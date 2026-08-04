import { PrismaClient, Prisma } from './generated/client.js';
// import generated prisma binaries containing scheme tables as methods/objects

const prisma: PrismaClient = new PrismaClient;
// get an instance of the database object from prisma

/**
 * return a random int between max and min (on call)
 * @param min 
 * @param max 
 * @returns integer
 */

const getRandomInt = (min: number, max:number) :number =>
{
	return (Math.floor(Math.random() * (max - min + 1) + min));
}

/**
 * return a ramdom element from an array using a random determined array index
 * @param array : string[]
 * @returns string
 */

const getRandomElement = (array: string[]) :string =>
{
	if(array.length === 0)
		return ("");
	const randomIndex = Math.floor(Math.random() * array.length);
	return (array[randomIndex]);
}

// just basic strings[] datastructures
const firstNamePool:string[] = ['john', 'terry', 'larry' , 'suzette', 'maxime', 'ratatouille', 'solange', 'gims', 'acer' ];
const lastNamePool:string[] = ['dubougnon', 'carpenterie' , 'leland' ,'frondeur', 'leboucher', 'creped', 'poudriere', 'camelier', 'fraise' ];
const domainPool:string[] = ['@gmail.com', '@yahoo.fr', '@laposte.net', '@screemer.net'];

/**
 * create an array from predetermined length then map it to respective corresponding indexes.
 * then produce random values by calling functions and return a final map Usertype object containing a randomized Users
 * @param undefined array
 * @param map builtin function
 * @return an initialized User
 */

const randomUsers = Array.from({length:10}).map((_, index) =>
{
	const firstName:string = getRandomElement(firstNamePool); 
	const lastName:string = getRandomElement(lastNamePool);
	const username:string =`${firstName}_${getRandomInt(100, 999)}`;
	const email:string = `${username}${getRandomElement(domainPool)}`;
	return {email, name: `${firstName} ${lastName}`, password: `pass_${getRandomInt(0, 999)}`, username};
})

// async function that actually populate the prisma user table
async function main()
{
	const CreatedUsers = await prisma.user.createMany({
		data: randomUsers,
		skipDuplicates: true,
	});
}

/**
 * since all theses operations take some time (especially if we add more users) they are run asynchronously
 * we then have to wait for them to finish, then we use try to screen for errors and prints them. finally (in any case),
 * we disconnect from the DB instance so Node doesnt hang
 */
try
{
	await main();
}
catch (e)
{
	console.log(e);
}
finally
{
	await prisma.$disconnect();
}