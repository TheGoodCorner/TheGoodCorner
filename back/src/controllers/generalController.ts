import { Request, Response } from "express";
import prisma from "../services/db.js";
import multer from 'multer';
// import express dependancies for request handling

void multer;
/**
 * generalController object creation with methods
 */
const generalController = 
{
	getHomePage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'home page !'});
	},
	getLoginPage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'login page !'});
	},
	getPaiementPage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'payment page !'});
	},
	getMessagesPage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'messages page !'});
	},
	getProfilPage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'profil page !'});
	},
	getProductsPage: (req: Request, res: Response) =>
	{
		void req;
		res.json({status: 'OK', message: 'product page !'});
	},
}

export default generalController;