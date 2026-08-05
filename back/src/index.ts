import express, { Express} from 'express';
import prisma from './services/db.js';
import PostRouter from './routes/products.js'
import GetRouter from './routes/getBasic.js';
// import express dependencies for handling request and response and routing methods

const app: Express = express(); // server init
const port: number = Number(process.env.port) || 3000; // port number

/**
 * this starts the server and let it listen on said port
 * @param {port} 3000
 * @param {empty array callback} ""
 */

// enable json body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', GetRouter);
app.use('/', PostRouter);

/**
 * asynchronous function that start the backend server while checking for errors
 */
async function startServer()
{
	try {
		/**
		 * listen to server socket on port 3000
		 * @param port server-port constant
		 * @param callback empty callback function
		 * @returns void undefined
		 */
		await prisma.$connect();
		console.log('Connected to db.');
		await new Promise<void> ((resolve, reject) =>
		{
			const server = app.listen(port, '0.0.0.0', () => 
			{
				console.log(`Serveur démarré sur http://localhost:${port}`);
				resolve();
			})
			server.on('error', (error: NodeJS.ErrnoException): void =>
			{
					if (error.code === 'EADDRINUSE')
						console.log(`port:${port} already in use cannot start server`);
					else
						console.log(`server failed to start:`, error.message);
				reject(error);
			})
		})
	}
	catch (error: unknown)
	{
		console.error('Failed to start application:', (error as Error).message);
		process.exit(1);
	}
}
startServer()
