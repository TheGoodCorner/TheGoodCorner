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
			const { stripeCurrency = 'eur', productId = [], quantity = [] } = req.body;

			if (!Array.isArray(productId) || !Array.isArray(quantity) || productId.length === 0)
				return res.status(400).json({ status: 'ERROR', message: 'le panier ne peut pas etre vide' });
			if (productId.length !== quantity.length)
				return res.status(400).json({ status: 'ERROR', message: 'Incohérence entre produits et quantités' });

			const quantityMap = new Map<string, number>();
			for (let i = 0; i < productId.length; i++) {
				const qty = Number(quantity[i]);
				if (isNaN(qty) || qty <= 0)
					return res.status(400).json({ status: 'ERROR', message: 'Quantité invalide' });
				quantityMap.set(productId[i], qty);
			}
			const [user, products] = await Promise.all([
				prisma.user.findUnique({ where: { id: userId } }),
				prisma.product.findMany({
					where: {
						id: { in: productId }
					}
				})
			]);
			if (!user)
				return res.status(404).json({ status: 'ERROR', message: 'User not found' });
			if (products.length !== productId.length)
				return res.status(400).json({ status: 'ERROR', message: 'certains produits sont introuvables en db' });

			const numericPrice = products.reduce((sum, item) => {
				const itemQty = quantityMap.get(item.id.toString()) || 0;
				return sum + (Number(item.price) * itemQty);
			}, 0);
			if (numericPrice <= 0)
				return res.status(400).json({ status: 'ERROR', message: 'Montant total invalide' });
			if (user.budget < numericPrice)
				return res.status(400).json({ status: 'ERROR', message: "L'utilisateur n'a plus assez de budget !", currentBudget: user.budget });
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

			const stripesCentsConvertedAmount = Math.round(numericPrice * 100);
			const stripePaymentIntent = await stripe.paymentIntents.create({
				amount: stripesCentsConvertedAmount,
				currency: stripeCurrency,
				customer: customerId,
				metadata: {
					userId: userId.toString(),
					amount: numericPrice.toString()
				}
			});
			try {
				const newTransaction = await prisma.$transaction(async (tx) => {
					for (const prods of products) {
						const requestedQty = quantityMap.get(prods.id.toString()) || 1;
						const updatedProduct = await tx.product.updateMany({
							where: {
								id: prods.id,
								quantity: { gte: requestedQty }
							},
							data: {
								quantity: { decrement: requestedQty }
							}
						});
						if (updatedProduct.count === 0)
							throw new Error(`OUT_OF_STOCK`);
					}
					return tx.payment.create({
						data: {
							stripeId: stripePaymentIntent.id,
							amount: numericPrice,
							currency: stripeCurrency,
							status: 'PENDING',
							userId: userId,
							// If your Payment model stores a list of items or references them:
							items: {
								create: products.map((prod) => ({
									productId: prod.id,
									quantity: quantityMap.get(prod.id.toString()) || 1,
									price: prod.price
								}))
							}
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
					return (res.status(400).json({ status: 'ERROR', message: 'Item went out of stock during checkout!' }));
				throw stockError;
			}
		} catch (error: any) {
			console.error('Erreur createTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
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
			const Stripetransaction = await prisma.payment.findFirst({
				where: {
					stripeId: transactionId
				}
			});
			if (!Stripetransaction)
				return res.status(404).json({ status: 'ERROR', message: 'Transaction not found' });
			if (Stripetransaction.userId !== userId)
				return res.status(403).json({ status: 'ERROR', message: "You do not have permission to view this transaction" });
			console.log('an individual transaction has been returned with its corresponding user');
			return res.status(200).json({ status: 'OK', data: Stripetransaction });
		} catch (error: any) {
			console.error('Erreur getTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
		}
	}
}
export default paymentController;