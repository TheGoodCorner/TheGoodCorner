import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const getPassword = ():string =>
{
	// check the file existence inside the docker container itself
	if (fs.existsSync('/run/secrets/db_password'))
		return fs.readFileSync('/run/secrets/db_password', 'utf8').trim();

	const localSecretPath = path.resolve(process.cwd(), '../.secrets/password.txt');
	
	// more for local testing when using npm run dev
	if (fs.existsSync(localSecretPath))
		return fs.readFileSync(localSecretPath, 'utf8').trim();
	return process.env.POSTGRES_PASSWORD || '';
}

const password = getPassword();
const user = process.env.POSTGRES_USER || 'GoodCorner';
const dbName = process.env.POSTGRES_DB || 'mydb';

const connectionString = `postgresql://${user}:${password}@localhost:5432/${dbName}?schema=public`;
const prisma = new PrismaClient({
	datasources: {
	db: {
	  url: connectionString,
	},
  },
});

export default prisma;