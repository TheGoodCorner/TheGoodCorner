import prisma from '../services/db.js';
import { Prisma } from '@prisma/client';
import { buildProduct } from '../services/products/buildProduct.js';
import 'dotenv/config';
// import generated prisma binaries containing scheme tables as methods/objects

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

const getRandomElement = <T>(array: T[]): T =>
{
	if(array.length === 0)
		throw new Error("Array cannot be empty");
	const randomIndex: number = Math.floor(Math.random() * array.length);
	const element = array[randomIndex];
	return array[randomIndex]!;
}

// just basic strings[] datastructures
const firstNamePool:string[] = ['john', 'terry', 'larry' , 'suzette', 'maxime', 'ratatouille', 'solange', 'gims', 'acer' ];
const lastNamePool:string[] = ['dubougnon', 'carpenterie' , 'leland' ,'frondeur', 'leboucher', 'creped', 'poudriere', 'camelier', 'fraise' ];
const domainPool:string[] = ['@gmail.com', '@yahoo.fr', '@laposte.net', '@screemer.net'];
const productNamePool = ['Mechanical Keyboard', 'Gaming Mouse', '27-inch Monitor', 'Noise Canceling Headphones', 'USB-C Hub', 'Desk Mat', 'Ergonomic Chair'];
const imagePool: string[] = Array.from({ length: 12 }, (_, i) => `images_db_test/image_${i}.jpg`);
const defaultCategories = [
	{ id: 1, name: 'Electronics' },
	{ id: 2, name: 'Home & Office' },
	{ id: 3, name: 'Gaming & Tech' },
];

/**
 * simple for loop that create a dummy randomized user and then push it to the array
 * @param undefined array
 * @param map builtin function
 * @return an initialized User
 */

const randomUsers: Prisma.UserCreateInput[] = [];
for (let i = 0; i < 10; i++) {
	const firstName: string = getRandomElement(firstNamePool);
	const lastName: string = getRandomElement(lastNamePool);
	const username: string = `${firstName}_${getRandomInt(100, 999)}`;
	const email: string = `${username}${getRandomElement(domainPool)}`;

	randomUsers.push({
		email,
		name: `${firstName} ${lastName}`,
		password: `pass_${getRandomInt(0, 999)}`,
		username
	});
}

/**
 * since all theses operations take some time and since Prisma databases operation and NodeJs runs asynchronously(especially if we add more users) they are run asynchronously
 * we then have to wait for them to finish, then we use try to screen for errors and prints them. finally (in any case),
 * we disconnect from the DB instance so Node doesnt hang
 */
async function main() {
  try {
	console.log('Seeding categories...');
	for (const category of defaultCategories) {
	  await prisma.category.upsert({
		where: { id: category.id },
		update: {},
		create: category,
	  });
	}

	console.log('Seeding users...');
	await prisma.user.createMany({
	  data: randomUsers,
	  skipDuplicates: true,
	});

	const users = await prisma.user.findMany({ select: { id: true } });

	console.log('Seeding products...');
	const productCreatePromises: Promise<any>[] = [];

	for (const user of users) {
		const productCount = getRandomInt(1, 4); // 1 to 4 products per user
		const selectedCategory = getRandomElement(defaultCategories);
		const selectedImage = getRandomElement(imagePool);

// const {accessToken, refreshToken} = generateTokens(savedUser.id, savedUser.email);
// 			const hashedRefreshToken = hashIt(refreshToken);
// 			await saveRefreshToken(savedUser.id, hashedRefreshToken);
// 			res.cookie('refreshToken', refreshToken, { // set the refreshToken cookie to refreshToken value and pass some options such as expiry date
// 				httpOnly: true,
// 				secure: process.env.NODE_ENV === 'production',
// 				sameSite: 'strict',
// 				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// 			});

	  for (let i = 0; i < productCount; i++) {
		const productInput = buildProduct({
		  body: {
			name: `${getRandomElement(productNamePool)} #${getRandomInt(10, 99)}`,
			price: getRandomInt(20, 500),
			quantity: getRandomInt(1, 10),
			CategoryId: getRandomElement(defaultCategories).id,
		  },
		  file: {
            filename: selectedImage,
          } as Express.Multer.File,
          userId: user.id,
        });

		productCreatePromises.push(
		  prisma.product.create({
			data: productInput,
		  })
		);
	  }
	}

	await Promise.all(productCreatePromises);
	console.log('Seeding successful !');
  } catch (e) {
	console.log('Error seeding the database', e);
	process.exit(1);
  } finally {
	await prisma.$disconnect();
  }
}
main();