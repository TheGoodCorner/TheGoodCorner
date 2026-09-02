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
				quantityMap.set(String(productId[i]), qty);
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
				const itemQty = quantityMap.get(String(item.id)) || 0;
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
			const cartItems = products.map((prod) => ({
				id: prod.id,
				qty: quantityMap.get(String(prod.id)) || 1
			}));
			const stripesCentsConvertedAmount = Math.round(numericPrice * 100);
			const stripePaymentIntent = await stripe.paymentIntents.create({
				amount: stripesCentsConvertedAmount,
				currency: stripeCurrency,
				customer: customerId,
				metadata: {
					userId: userId.toString(),
					amount: numericPrice.toString(),
					cart: JSON.stringify(cartItems)
				}
			});
			try {
				const newTransaction = await prisma.$transaction(async (tx) => {
					for (const prods of products) {
						const requestedQty = quantityMap.get(String(prods.id)) || 1;
						if (prods.quantity! < requestedQty)
							return res.status(400).json({ status: 'ERROR', message: `Stock insuffisant pour le produit: ${prods.id}` });
					}
					return tx.payment.create({
						data: {
							stripeId: stripePaymentIntent.id,
							amount: numericPrice,
							currency: stripeCurrency,
							status: 'PENDING',
							userId: userId,
						}
					});
				});
				throw new Error('OUT_OF_STOCK');
			} catch (stockError: any) {
				await stripe.paymentIntents.cancel(stripePaymentIntent.id);
				if (stockError.message === 'OUT_OF_STOCK') {
					return res.status(400).json({ status: 'ERROR', message: 'Item went out of stock during checkout!' });
				}
				throw stockError;
			}
		} catch (error: any) {
			console.error('Erreur createTransaction:', error);
			return res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
		}
	},
	stripeWebhook: async (req: Request, res: Response) => {
		const sig = req.headers['stripe-signature'] as string;
		let event: Stripe.Event;

		try {
			// req.body MUST be the raw Buffer here. If express.json() parses it first, this throws an error.
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET!
			);
		} catch (err: any) {
			console.error(`Webhook signature verification failed: ${err.message}`);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}

		// Handle successful payment
		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;

			const transaction = await prisma.payment.findFirst({
				where: { stripeId: paymentIntent.id }
			});

			// Idempotency check: prevent duplicate deductions if Stripe resends the event
			if (!transaction || transaction.status === 'SUCCEEDED') {
				return res.status(200).json({ received: true });
			}

			// Extract cart from metadata
			const rawCart = paymentIntent.metadata?.cart;
			const cart: Array<{ id: string; qty: number }> = rawCart ? JSON.parse(rawCart) : [];
			const amountToDeduct = Math.round(transaction.amount);

			try {
				await prisma.$transaction(async (tx) => {
					// 1. Decrement product stock
					for (const item of cart) {
						await tx.product.update({
							where: { id: Number(item.id) },
							data: { quantity: { decrement: item.qty } }
						});
					}

					// 2. Decrement user budget securely
					await tx.user.updateMany({
						where: {
							id: transaction.userId,
							budget: { gte: amountToDeduct } // ensure they didn't spend it elsewhere in the last 2 minutes
						},
						data: { budget: { decrement: amountToDeduct } }
					});

					// 3. Mark payment as completed
					await tx.payment.update({
						where: { id: transaction.id },
						data: { status: 'SUCCEEDED' }
					});
				});
				console.log(`Payment ${paymentIntent.id} successfully processed.`);
			} catch (dbError) {
				console.error('Error applying DB updates:', dbError);
				return res.status(500).end(); // Let Stripe retry later
			}
		}

		// Handle failed or canceled payments
		else if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;

			// Because we used Option 2, we never decremented stock in createTransaction. 
			// We just need to update the payment status to keep our records accurate.
			await prisma.payment.updateMany({
				where: { stripeId: paymentIntent.id },
				data: { status: event.type === 'payment_intent.canceled' ? 'CANCELED' : 'FAILED' }
			});
		}

		// Acknowledge receipt to Stripe
		return res.status(200).json({ received: true });
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