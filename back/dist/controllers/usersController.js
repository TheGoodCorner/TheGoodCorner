import { PrismaClient } from '@prisma/client';
import { comparePassword, hashIt } from "../utils/securityUtils.js";
import { FindUserByEmail, CreateDbUser } from "../services/manageUsers.js";
import { generateTokens, verifyRefreshToken } from '../utils/jsonWebTokens.js';
import { saveRefreshToken } from '../services/manageUsers.js';
const prisma = new PrismaClient; // get the prisma client instance
const BASIC_COOKIE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};
const userController = {
    createUser: async (req, res) => {
        try {
            const password = req.body.password;
            const email = req.body.email;
            const username = req.body.username;
            if (!email || !password || !username)
                return res.status(400).json({ status: 'ERROR', message: 'Email, password, and name are required' });
            const existingUser = await FindUserByEmail(email);
            if (existingUser)
                return res.status(400).json({ status: 'ERROR', message: 'Email already exists' });
            const newuser = await CreateDbUser({
                email: email,
                password: hashIt(password),
                username: username,
            });
            const { accessToken, refreshToken } = generateTokens(newuser.id, newuser.email);
            const hashedRefreshToken = hashIt(refreshToken);
            await saveRefreshToken(newuser.id, hashedRefreshToken);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            console.log(`User created`);
            return res.status(201).json({ status: 'OK', message: 'User created !', accessToken, data: { email: req.body.email, name: req.body.name, username: req.body.username } });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error });
        }
    },
    login: async (req, res) => {
        try {
            const password = req.body.password;
            const email = req.body.email;
            if (!password || !email)
                return (res.status(400).json({ status: 'ERROR', message: 'Email and password cannot be omitted' }));
            const existingUser = await FindUserByEmail(email);
            if (!existingUser)
                return (res.status(400).json({ status: 'ERROR', message: 'Email not registered on our site' }));
            const passMatch = comparePassword(password, existingUser.password);
            if (!passMatch)
                return (res.status(400).json({ status: 'ERROR', message: 'Invalid credential' }));
            console.log(`User logged in`);
            return res.status(200).json({ status: 'OK', message: 'User logged in !', data: { email: req.body.email, password: password } });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error });
        }
    },
    logout: async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken; // get the resfreshToken from the cookies if present
            if (refreshToken) {
                const hashedToken = hashIt(refreshToken); // hash it to delete it in database (matching data)
                await prisma.refreshToken.deleteMany({ where: { hashedToken } }); // delete it
            }
            res.clearCookie('refreshToken', BASIC_COOKIE); // reset the refreshToken cookie to BASIC_COOKIE value
            return (res.status(200).json({ status: 'OK', message: 'User logged out successfully' }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error }));
        }
    },
    refresh: async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken; // get the resfreshToken from the cookies if present
            if (!refreshToken) {
                return (res.status(401).json({ status: 'ERROR', message: 'Refresh token missing' }));
            }
            const decodedPayload = verifyRefreshToken(refreshToken);
            const hashedToken = hashIt(refreshToken); // hash it to find it in database (matching data)
            const storedToken = await prisma.refreshToken.findUnique({
                where: { hashedToken },
            });
            if (!storedToken || storedToken.expiresAt < new Date()) {
                res.clearCookie('refreshToken', BASIC_COOKIE); // clear the invalid token
                return (res.status(403).json({ status: 'ERROR', message: 'Invalid or expired refresh token' }));
            }
            const { accessToken } = generateTokens(decodedPayload.id, decodedPayload.email); // generate new tokens for the old token's id and email (user)
            return res.status(200).json({ status: 'OK', message: 'Token refreshed successfully', accessToken, });
        }
        catch (error) {
            console.error(error);
            res.clearCookie('refreshToken', BASIC_COOKIE); // clear the token 
            return (res.status(403).json({ status: 'ERROR', message: 'Invalid or expired refresh token' + error }));
        }
    }
    // removeUser: async (req:Request, res:Response) =>{
    // 	try {
    // 	}
    // 	catch (error) {
    // 	}
    // },
    // updateUser: async (req:Request, res:Response) =>{
    // 	try {
    // 	}
    // 	catch (error) {
    // 	}
    // }
};
export default userController;
