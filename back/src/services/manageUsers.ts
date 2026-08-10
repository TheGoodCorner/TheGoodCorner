import { Prisma, PrismaClient} from '../prisma/generated/client.js';
import prisma from "./db.js";
import 'dotenv/config';

/**
 *  find the user by checking inside the prisma database for its email, if occurence found returns said user
 * @param email 
 * @returns said user
 */
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

