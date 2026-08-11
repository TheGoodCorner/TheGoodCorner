import prisma from "../services/db.js";
import { comparePassword } from "../utils/securityUtils.js";
import multer from 'multer';
// import express dependancies for request handling
void multer;
/**
 * generalController object creation with methods
 */
const generalController = {
    getHomePage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'home page !' });
    },
    getLoginPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'login page !' });
    },
    getPaiementPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'payment page !' });
    },
    getMessagesPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'messages page !' });
    },
    getProfilPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'profil page !' });
    },
    getProductsPage: (req, res) => {
        void req;
        res.json({ status: 'OK', message: 'product page !' });
    },
    getSignInPage: async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ status: 'ERROR', message: 'Email and password are required' });
            }
            const email = req.body.email;
            const password = req.body.password;
            let user = await prisma.user.findUnique({ where: { email: email } });
            console.log(user);
            if (user && comparePassword(password, user.password)) {
                return res.json({ status: 'OK', user });
            }
            return res.json({ status: 'NOT OK' });
        }
        catch (error) {
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' + error })); // a voir, pas de throw
        }
    },
};
export default generalController;
