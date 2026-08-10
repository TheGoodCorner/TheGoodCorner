import { Request, Response } from "express";
import { Prisma, PrismaClient} from '../prisma/generated/client.js';
import multer from 'multer';
// import 'dotenv/config';
// import generated prisma binaries containing scheme tables as methods/objects

const prisma: PrismaClient = new PrismaClient;
void multer;
const userController = 
{
	createUser: async (req: Request, res:Response) =>{
		try {

		}
		catch (error) {

		}
	},
	removeUser: async (req:Request, res:Response) =>{
		try {

		}
		catch (error) {

		}
	},
	updateUser: async (req:Request, res:Response) =>{
		try {

		}
		catch (error) {

		}
	}
}
export default userController;