import { Request, Response } from "express";
import prisma from "../services/db.js";
import { comparePassword } from "../utils/securityUtils.js";
import { ok } from "node:assert";
import { verifyAcessToken } from "../utils/jsonWebTokens.js";
// import express dependancies for request handling

/**
 * generalController object creation with methods
 */
const generalController = 
{
	getHomePage: (req: Request, res: Response) =>
	{
		void req;
		res.status(200).json({status: 'OK', message: 'home page !'});
	},
	getLoginPage: (req: Request, res: Response) =>
	{
		void req;
		res.status(200).json({status: 'OK', message: 'login page !'});
	},
	getPaiementPage: (req: Request, res: Response) =>
	{
		void req;
		res.status(200).json({status: 'OK', message: 'payment page !'});
	},
	getMessagesPage: (req: Request, res: Response) =>
	{
		void req;
		res.status(200).json({status: 'OK', message: 'messages page !'});
	},
	getProfilPage: (req: Request, res: Response) =>
	{
		void req;
		res.status(200).json({status: 'OK', message: 'profil page !'});
	},
	getProductsPage: async (_req: Request, res: Response) =>
	{
		try{
			const products = await prisma.product.findMany();
			return(res.status(200).json({status: 'OK', data:products}));
		}
		catch(error){
			console.log(` an error ocurred inside the productPage getter` + error);
			res.status(500).json({status: 'ERROR', message: 'failed to retrieve product', error: "Unknown error"});
		}
	},
	getSignUpPage: async (req: Request, res: Response) =>
	{
		try
		{
			if(!req.body.email || !req.body.password) 
			{
				return res.status(400).json({status: 'ERROR', message: 'Email and password are required'});
			}
			const email = req.body.email;
			const password = req.body.password;
			let user = await prisma.user.findUnique({where:{email: email}});
			console.log(user)
			if(user && comparePassword(password, user.password))
			{
				return res.json({status: 'OK', user})
			}
			return res.json({status: 'NOT OK'})
		}catch(error){
			return (res.status(500).json({status: 'ERROR', message: 'Internal server error'}))
		}
	},
	userProfile: async (req: Request, res: Response) => {
	try {
		// ✅ Lire le token depuis le header Authorization
		const authHeader = req.headers.authorization;
		
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(400).json({ 
			status: 'ERROR', 
			message: 'Token manquant ou invalide' 
		});
		}

		// Extraire le token (enlever "Bearer ")
		const token = authHeader.slice(7);
		
		// Vérifier et décoder le token
		const decoded = verifyAcessToken(token);
		const { email } = decoded;
		
		// ⚠️ IMPORTANT : ajouter await sinon vous retournez une Promise
		const user = await prisma.user.findUnique({where: {email}});
		
		return res.status(200).json({status: 'OK', data: user});
	} catch(error) {
		return res.status(400).json({
		status: 'ERROR', 
		message: 'Invalid or expired refresh token: qwqwqwq'
		});
	}
	}

}

export default generalController;