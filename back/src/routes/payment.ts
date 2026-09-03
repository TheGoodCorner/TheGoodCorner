import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
const paymentRouter = Router();

paymentRouter.post('/newPayment', AuthenticateToken , paymentController.createTransaction);
paymentRouter.get('/transactions', AuthenticateToken, paymentController.getAllTransactions);
paymentRouter.get('/transactions/:id', AuthenticateToken, paymentController.getTransaction);

export default paymentRouter;