import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { AuthenticateToken } from '../services/middlewareAuthenticateToken.js';
const paymentRouter = Router();

/**
 * @openapi
 * /newPayment:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Stripe payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cart]
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Payment created
 *       401:
 *         description: Unauthorized
 */
paymentRouter.post('/newPayment', AuthenticateToken, paymentController.createTransaction);

/**
 * @openapi
 * /transactions:
 *   get:
 *     tags: [Payments]
 *     summary: Get all transactions for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
paymentRouter.get('/transactions', AuthenticateToken, paymentController.getAllTransactions);

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get a single transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
paymentRouter.get('/transactions/:id', AuthenticateToken, paymentController.getTransaction);

/**
 * @openapi
 * /walletTopUp/{id}:
 *   post:
 *     tags: [Payments]
 *     summary: Add funds to a user's wallet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Wallet topped up
 *       401:
 *         description: Unauthorized
 */
paymentRouter.post('/walletTopUp/:id', AuthenticateToken, paymentController.topUp);

export default paymentRouter;