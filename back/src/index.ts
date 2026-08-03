import express, { Express} from 'express';
import router from './routes/routes.js'
// import express dependencies for handling request and response and routing methods

const app: Express = express(); // server init
const port: Number = Number(process.env.port) || 3000; // port number

/**
 * this starts the server and let it listen on said port
 * @param {port} 3000
 * @param {empty array callback} ""
 */

// enable json body parsing
app.use(express.json());
app.use('/', router);

const server = app.listen(port, () => 
{
	console.log(`Serveur démarré sur http://localhost:${port}`);
})
server.on('error', (error: NodeJS.ErrnoException): void =>
{
	if (error.code === 'EADDRINUSE')
		console.log(`port:${port} already in use cannot start server`);
	else
		console.log(`server failed to start:`, error.message);
})
