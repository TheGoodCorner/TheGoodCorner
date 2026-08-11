import { Prisma, PrismaClient } from '@prisma/client';
import prisma from "./db.js";
import 'dotenv/config';

/**
 *  find the user by checking inside the prisma database for its email, if occurence found returns said user
 * @param email 
 * @returns said user
 */
const prismaInstance = new PrismaClient();
export const FindUserByEmail = async (email: string) =>
{
	return (await prisma.user.findUnique({where: {email}}));
}

/**
 * add a user's data to the prisma database using a data object (prisma.UsersCreateInput)
 * @param data 
 * @returns void
 */
export const CreateDbUser = async (data: Prisma.UserCreateInput) =>
{
	return (await prisma.user.create({data}));
}

export const saveRefreshToken = async (userId:number, hashedToken:string) =>{
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // add a 7 days expiration
	return (await prismaInstance.refreshToken.create({
		data: {
			userId,
			hashedToken,
			expiresAt,
		}
	}))
}

