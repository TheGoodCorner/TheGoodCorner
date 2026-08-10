import { Prisma, PrismaClient} from '../prisma/generated/client.js';
import prisma from "./db.js";
import 'dotenv/config';

export const FindUserByEmail = async (email: string) =>
{
	return (await prisma.user.findUnique({where: {email}}));
}

export const CreateDbUser = async (data: Prisma.UserCreateInput) =>
{
	return (await prisma.user.create({data}));
}

