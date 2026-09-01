import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
const paymentRouter = Router();

paymentRouter.post('/payment', AuthenticateToken , paymentController.createTransaction);
paymentRouter.get('/transactions', AuthenticateToken, paymentController.getTransactions);

export default paymentRouter;