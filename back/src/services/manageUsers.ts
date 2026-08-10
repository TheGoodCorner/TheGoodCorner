import { Prisma, PrismaClient} from '../prisma/generated/client.js';
import 'dotenv/config';

const prisma: PrismaClient = new PrismaClient;

const User: Prisma.UserCreateInput[] = [];

const firstName: string = ;
const lastName: string = ;
const username: string = ;
const email: string = ;
User.push({
		email,
		name: `${firstName} ${lastName}`,
		password: "",
		username
});

try 
{
	await prisma.user.create(
	{
		data: User
	});
	console.log("user sucessfully created");
}
catch (error)
{

}