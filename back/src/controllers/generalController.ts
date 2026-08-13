import { Request, Response } from "express";
import prisma from "../services/db.js";
import { comparePassword } from "../utils/securityUtils.js";
import { AuthenticatedRequest } from "../interfaces/interfaces.js";
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
	getProductsPage: async (_req: Request, res: Response) =>
	{
		try{
			const products = await prisma.product.findMany(
				{include: {category: true}}
			);
			console.log('all product got sucessfully returned');
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
	userProfile: async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.user)
 			return (res.status(401).json({ status: 'ERROR', message: 'Unauthorized' }));
		// puisque'on utilise une authenticatedRequest on peut direct prendre le user appended dessus.
		const user = req.user;
		const email = user.email;
		const founduser = await prisma.user.findUnique({where: {email}});
		console.log("user profile loaded");
		return (res.status(200).json({status: 'OK', data: founduser}));
	}
	catch(error)
	{
		return res.status(500).json({status: 'ERROR', message: 'Internal server error'});
	}
	}
}

export default generalController;