import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
// import generated prisma binaries containing scheme tables as methods/objects
const prisma = new PrismaClient;
// get an instance of the database object from prisma
/**
 * return a random int between max and min (on call)
 * @param min
 * @param max
 * @returns integer
 */
const getRandomInt = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1) + min));
};
/**
 * return a ramdom element from an array using a random determined array index
 * @param array : string[]
 * @returns string
 */
const getRandomElement = (array) => {
    if (array.length === 0)
        return ("");
    const randomIndex = Math.floor(Math.random() * array.length);
    const element = array[randomIndex];
    return (element !== undefined ? element : "");
};
// just basic strings[] datastructures
const firstNamePool = ['john', 'terry', 'larry', 'suzette', 'maxime', 'ratatouille', 'solange', 'gims', 'acer'];
const lastNamePool = ['dubougnon', 'carpenterie', 'leland', 'frondeur', 'leboucher', 'creped', 'poudriere', 'camelier', 'fraise'];
const domainPool = ['@gmail.com', '@yahoo.fr', '@laposte.net', '@screemer.net'];
/**
 * simple for loop that create a dummy randomized user and then push it to the array
 * @param undefined array
 * @param map builtin function
 * @return an initialized User
 */
const randomUsers = [];
for (let i = 0; i < 10; i++) {
    const firstName = getRandomElement(firstNamePool);
    const lastName = getRandomElement(lastNamePool);
    const username = `${firstName}_${getRandomInt(100, 999)}`;
    const email = `${username}${getRandomElement(domainPool)}`;
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
try {
    await prisma.user.createMany({
        data: randomUsers, skipDuplicates: true
    });
    console.log("seeding successful !");
}
catch (e) {
    console.log("error seeding the database", e);
    process.exit(1);
}
finally {
    await prisma.$disconnect();
}
