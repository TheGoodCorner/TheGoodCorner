import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { createPayment } from '../api/paymentApi';
import { useCartStore } from '../stores/cartStore';
import CheckoutForm from '../components/checkout/checkoutForm';

loadStripe.setLoadParameters({ advancedFraudSignals: false });
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const ELEMENTS_OPTIONS = {
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#161a22',
      colorText: '#f3f4f6',
      colorDanger: '#ef4444',
      borderRadius: '8px',
    },
  },
};

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCartStore();

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const total = cartItems?.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0) || 0;

    const handleCheckout = async () => {
        try {
            setLoading(true);
            setError(null);

            const productId = cartItems.map((item) => item.id);
            const quantity = cartItems.map((item) => item.quantity);

            const payload = {
                productId,
                quantity,
                stripeCurrency: 'eur',
            };

            const res = await createPayment(payload);
            const secret = res.data?.clientSecret || res.clientSecret;

            if (secret) {
                setClientSecret(secret);
            } else {
                setError("Impossible d'initialiser le formulaire de paiement.");
            }
        } catch (err) {
            console.error('Erreur lors du paiement :', err);
            setError(err.response?.data?.message || 'Le budget est insuffisant !');
        } finally {
            setLoading(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg)] px-4">
                <div className="max-w-md w-full bg-[#1e232d] border border-gray-800 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-white mb-4">Votre panier est vide</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl transition cursor-pointer"
                    >
                        Continuer les achats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-[var(--color-bg)] py-12 px-4">
            <div className="max-w-xl w-full bg-[#1e232d] border border-gray-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-6">Récapitulatif de la commande</h1>

                <ul className="divide-y divide-gray-800/80 mb-6">
                    {cartItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center py-3 text-sm">
                            <span className="text-gray-300">
                                {item.title || item.name} <span className="text-gray-500 text-xs">x{item.quantity || 1}</span>
                            </span>
                            <span className="text-gray-200 font-medium">
                                {(item.price * (item.quantity || 1)).toFixed(2)} €
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-lg font-bold text-white mb-6">
                    <span>Total :</span>
                    <span className="text-emerald-400">{total.toFixed(2)} €</span>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {!clientSecret ? (
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-md"
                    >
                        {loading ? 'Initialisation...' : `Payer ${total.toFixed(2)} €`}
                    </button>
                ) : (
                    <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
                        <CheckoutForm
                            clientSecret={clientSecret}
                            onSuccess={() => {
                                if (clearCart) clearCart();
                                navigate('/checkout/success');
                            }}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
}