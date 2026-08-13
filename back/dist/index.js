import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import prisma from './services/db.js';
import productRouter from './routes/products.js';
import generalRouter from './routes/generalGetRouter.js';
import userRouter from './routes/users.js';
// import { printRequest } from './utils/printHttpRequest.js';
const app = express(); // server initialization
const port = Number(process.env.port) || 3000; // port number
app.use(cors({
    origin: 'https://localhost:4443',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));
app.use(express.json()); // enable json body parsing
app.use(express.urlencoded({ extended: true })); // allow processing of urls encoded forms (json) to access as object
app.use(cookieParser()); // allow processing of cookie headers to access as objects
app.use('/uploads', express.static(path.resolve('uploads'))); // allow static file serving for images 
app.use('/', generalRouter); // general routes
app.use('/', productRouter); // product routes
app.use('/', userRouter); // Users routes
// app.use(printRequest);
/**
 * asynchronous function that start the backend server while checking for errors
 * @returns a void promise relative to the async nature of the function
 */
async function startServer() {
    try {
        await prisma.$connect(); // await for promise fullfilment, here connect return a void promise. when fullfilled control flow continue, else error
        console.log('Connected to db.');
        await new Promise((resolve, reject) => // same as above, block until promise is fulfilled (server started correctly on port)
         {
            const server = app.listen(port, '0.0.0.0', () => {
                console.log(`Serveur démarré sur http://localhost:${port}`);
                resolve(); // resolve the promise
            });
            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE')
                    console.log(`port:${port} already in use cannot start server`);
                else
                    console.log(`server failed to start:`, error.message);
                reject(error); // reject the promise
            });
        });
    }
    catch (error) {
        console.error('Failed to start application:' + error);
        process.exit(1);
    }
}
startServer();
/**
 * when the server sucessfully starts, it listen on port and then the routes take the lead on how the server behave
 * depending on what request arrive to the backend.
 */ 
