import prisma from "../services/db.js";
import Stripe from 'stripe';
// request has already been processed by multer before arriving here since its a middleware, req.file has been filtered already
/**
 * create a transaction inside the prisma database by taking the request and sending the json object
 * @param request
 * @returns promise containing the json object
 */
const stripe = new Stripe(process.env.STRIPE_KEY);
const paymentController = {
    createTransaction: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
            const newTransactionStripe = await stripe.paymentIntents.create({
                amount: Number(req.body.amount),
                currency: req.body.currency
            });
            console.log(`************************************`);
            const newTransaction = await prisma.payment.create({
                data: {
                    amount: Number(req.body.amount),
                    currency: req.body.currency,
                    stripeId: newTransactionStripe.id,
                    status: newTransactionStripe.status,
                    userId: userId
                }
            });
            return (res.status(201).json({ status: 'OK', data: newTransaction }));
        }
        catch (error) {
            console.error(error);
            return (res.status(500).json({ status: 'ERROR', message: 'Internal server error' }));
        }
    },
    getTransactions: async (req, res) => {
        try {
            console.log(`************************************`);
            const userId = req.user?.id;
            console.log(`******************${userId}******************`);
            if (!userId)
                return res.status(401).json({ status: 'ERROR', message: 'Unauthorized' });
            const transactions = await prisma.payment.findMany();
            return res.status(200).json({ status: 'OK', data: transactions });
        }
        catch (error) {
            return res.status(400).json({ status: 'ERROR', message: 'Internal server error' });
        }
    }
};
export default paymentController;
