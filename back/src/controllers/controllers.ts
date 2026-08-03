// handle request/response logics
import { Request, Response } from "express";
// import express dependancies for request handling

/**
 * controller object creation with methods
 */
const controller = 
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
	}
}

export default controller;