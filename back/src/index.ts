import express, { Express, Request, Response, NextFunction} from 'express';
import prisma from './services/db.js';
import PRoutes from './routes/products.js'
import GRoutes from './routes/getBasic.js';
import URoutes from './routes/users.js';
import cors from 'cors';
// import express dependencies for handling request and response and routing methods

const app: Express = express(); // server init
const port: number = Number(process.env.port) || 3000; // port number

/**
 * this starts the server and let it listen on said port
 * @param {port} 3000
 * @param {empty array callback} ""
 */

// enable json body parsing

app.use(cors({
  origin: '*', // Remplacez par le domaine de votre frontend (ou '*' pour tout autoriser)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
//   // Affiche le body s'il y en a un (POST/PUT)
//   if (Object.keys(req.body || {}).length > 0) {
//     console.log('Body:', JSON.stringify(req.body, null, 2));
//   }
//   void res;
//   next(); // Passer la main au middleware/routeur suivant
// });

app.use('/', GRoutes); // general routes
app.use('/', PRoutes); // product routes
app.use('/', URoutes); // Users /auth/register

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