import { Request, Response } from "express";
import { Prisma, PrismaClient} from '../prisma/generated/client.js';
import multer from 'multer';
import { comparePassword, hashPassword } from "../utils/password.js";
import { FindUserByEmail, CreateDbUser } from "../services/manageUsers.js";
import { error } from "node:console";

const prisma: PrismaClient = new PrismaClient; // get the prisma client instance
const userController = 
{
	createUser: async (req: Request, res: Response) =>{// retirer Unique de la bdd pour le mdp
		try {
			const password = req.body.password;
			const email = req.body.email;
			const username = req.body.username;

			if (!email || !password || !username)
				return res.status(400).json({ status: 'ERROR', message: 'Email, password, and name are required' });
			
			const existingUser = await FindUserByEmail(email);
			
			if (existingUser)
				return res.status(400).json({ status: 'ERROR', message: 'Email already exists'});
			
			const newuser = await CreateDbUser(
				{
					email: email,
					password: hashPassword(password),
					username: username,
				}
			)
			console.log(`User created`);
			return res.status(201).json({status: 'OK', message: 'User created !', data: {email: req.body.email, name: req.body.name, username: req.body.username }});
		}
		catch (error) { // pareil pas de throw
			console.error(error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error });
		}
	},
	login: async (req:Request, res:Response) =>
	{
		try{
			const password = req.body.password;
			const email = req.body.email;

			if (!password || !email)
				return (res.status(400).json({ status: 'ERROR', message: 'Email and password cannot be omitted'}));
			const existingUser = await FindUserByEmail(email);
			if (!existingUser)
				return (res.status(400).json({ status: 'ERROR', message: 'Invalid credentials'}));
			const passMatch = comparePassword(password, existingUser.password);
			if (!passMatch)
				return (res.status(400).json({ status: 'ERROR', message: 'Invalid credentials'}));
			console.log(`User logged in`);
			return res.status(200).json({status: 'OK', message: 'User logged in !', data: { email: req.body.email, password: password}});
		}
		catch (error){
			console.error(error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error });
		}
	},
	logout: async (_req:Request, res:Response) =>
	{
		try{
			res.clearCookie('token', {httpOnly: true,secure: process.env.NODE_ENV === 'production',sameSite: 'strict'
		});
			return res.status(200).json({ status: 'OK', message: 'User logged out successfully' 
		});
		}
		catch (error){
			console.error(error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error });
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
}
export default userController;