import { Request, Response } from "express";
import prisma from "../services/db.js";
import { AuthenticatedRequest } from "../interfaces/interfaces.js";
import Stripe from 'stripe';
// request has already been processed by multer before arriving here since its a middleware, req.file has been filtered already
/**
 * create a transaction inside the prisma database by taking the request and sending the json object
 * @param request
 * @returns promise containing the json object
 */
const stripe = new Stripe(process.env.STRIPE_KEY || '');
const paymentController =
{
	createTransaction: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId)
				return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
			const { amount, stripeCurrency = 'eur' } = req.body;
			const numericAmount = Number(amount);

			if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0)
				return res.status(400).json({ status: 'ERROR', message: 'montant invalide' });
			const [user, product] = await Promise.all([
				prisma.user.findUnique({ where: { id: userId } }),
				prisma.product.findUnique({ where: { id: productId } })
			]);
			if (!user)
				return res.status(404).json({ status: 'ERROR', message: 'User not found' });
			if (!product)
				return res.status(404).json({ status: 'ERROR', message: 'Product not found' });

			if (user.budget < numericAmount) {
				return res.status(400).json({
					status: 'ERROR',
					message: "L'utilisateur n'a plus assez de budget !",
					currentBudget: user.budget
				});
			}
			let customerId = user.stripeCustomerId;
			if (!customerId) {
				const customer = await stripe.customers.create({
					email: user.email,
					name: user.username,
					metadata: { userId: user.id.toString() }
				});
				await prisma.user.update({
					where: { id: userId },
					data: { stripeCustomerId: customer.id }
				});
				customerId = customer.id;
			}

			const stripesCentsConvertedAmount = Math.round(numericAmount * 100);
			const stripePaymentIntent = await stripe.paymentIntents.create({
				amount: stripesCentsConvertedAmount,
				currency: stripeCurrency,
				customer: customerId,
				metadata: {
					userId: userId.toString(),
					productId: product.id.toString(),
					amount: numericAmount.toString()
				}
			});
			try {
				const newTransaction = await prisma.$transaction(async (tx) => {
					const updatedProduct = await tx.product.updateMany({
						where: {
							id: product.id,
							quantity: { gte: product.quantity as number }
						},
						data: {
							quantity: { decrement: product.quantity as number }
						}
					});
					if (updatedProduct.count === 0) {
						throw new Error('OUT_OF_STOCK');
					}
					return tx.payment.create({
						data: {
							stripeId: stripePaymentIntent.id,
							amount: numericAmount,
							currency: stripeCurrency,
							status: 'PENDING',
							userId: userId,
							productId: product.id,
							quantity: product.quantity
						}
					});
				});
				return res.status(201).json({
					status: 'OK',
					data: {
						transaction: newTransaction,
						clientSecret: stripePaymentIntent.client_secret
					}
				});

			} catch (stockError: any) {
				await stripe.paymentIntents.cancel(stripePaymentIntent.id);
				if (stockError.message === 'OUT_OF_STOCK') 
					return (res.status(400).json({	status: 'ERROR',	message: 'Item went out of stock during checkout!'}));
				throw stockError;
			}
		} catch (error: any) {
			console.error('Erreur createTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
		}
	},
	confirmTransaction: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId)
				return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });

			const transactionId = req.params.id as string; // This is the stripeId (e.g. pi_3MtwbL2eZvKYlo2C0XXXXXX)
			if (!transactionId)
				return res.status(400).json({ status: 'ERROR', message: 'Payment Intent ID is required' });
			const transaction = await prisma.payment.findFirst({
				where: {
					stripeId: transactionId,
					userId: userId
				}
			});
			if (!transaction)
				return res.status(404).json({ status: 'ERROR', message: 'Transaction not found' });
			if (transaction.status !== 'PENDING')
				return res.status(400).json({ status: 'ERROR', message: `Transaction is already in status ${transaction.status}` });
			const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
			if (paymentIntent.status === 'succeeded') {
				const freshUser = await prisma.user.findUnique({ where: { id: userId } });
				if (!freshUser || freshUser.budget < transaction.amount)
					return (res.status(400).json({ status: 'ERROR', message: 'Budget insuffisant au moment de la confirmation' }));
				const [updatedTransaction, updatedUser] = await prisma.$transaction([
					prisma.payment.update({
						where: { id: transaction.id },
						data: { status: 'SUCCEEDED' }
					}),
					prisma.user.update({
						where: { id: userId },
						data: {
							budget: {
								decrement: Math.round(transaction.amount)
							}
						}
					})
				]);
				console.log('a transaction has been confirmed');
				return (res.status(200).json({ status: 'OK', message: 'Payment confirmed successfully', data: { transaction: updatedTransaction, remainingBudget: updatedUser.budget } }));
			}
			else {
				await prisma.payment.update({
					where: { id: transaction.id },
					data: { status: paymentIntent.status.toUpperCase() }
				});
				console.log('a transaction status has been updated');
				return (res.status(400).json({ status: 'ERROR', message: `Payment has not succeeded. Current status: ${paymentIntent.status}` }));
			}
		} catch (error: any) {
			console.error('Erreur confirmTransaction:', error);
			return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
		}
	},
	getAllTransactions: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId)
				return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
			const user = await prisma.user.findUnique({ where: { id: userId }, select: { sellerEliteStatus: true } });
			if (!user)
				return res.status(404).json({ status: 'ERROR', message: 'User not found' });
			if (!user.sellerEliteStatus)
				return res.status(403).json({ status: 'ERROR', message: 'User does not have the permissions to check on all transactions' });
			const transactions = await prisma.payment.findMany({
				include: {
					user: {
						select: {
							id: true,
							email: true,
							username: true,
							stripeCustomerId: true,
							name: true,
							avatar: true,
							phoneNumber: true,
							budget: true,
							sellerRating: true,
							sellerReviewCount: true,
							location: true,
							createdAt: true,
						}
					}
				}
			});
			console.log('all transactions have been returned with their corresponding user');
			return res.status(200).json({ status: 'OK', data: transactions })
		} catch (error) {
			console.error('Erreur getAllTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
		}
	},
	getTransaction: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId)
				return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
			const transactionId = req.params.id as string; // This is the stripeId (e.g. pi_3MtwbL2eZvKYlo2C0XXXXXX)
			if (!transactionId)
				return res.status(400).json({ status: 'ERROR', message: 'Payment Intent ID is required' });
			const transaction = await prisma.payment.findFirst({
				where: {
					stripeId: transactionId,
					userId: userId
				}
			});
			if (!transaction)
				return res.status(404).json({ status: 'ERROR', message: 'Transaction not found' });
			if (transaction.userId !== userId)
				return res.status(404).json({ status: 'ERROR', message: 'can\'t check on others transactions' });
			console.log('an individual transaction has been returned with its corresponding user');
			return res.status(200).json({ status: 'OK', data: transaction });
		} catch (error: any) {
			console.error('Erreur getTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
		}
	}
}
export default paymentController;