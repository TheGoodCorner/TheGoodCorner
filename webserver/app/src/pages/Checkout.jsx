import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { createPayment } from '../api/paymentApi';
import { useCartStore } from '../stores/cartStore';
import CheckoutForm from '../components/checkout/checkoutForm';

loadStripe.setLoadParameters({ advancedFraudSignals: false });
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCartStore();

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = useMemo(() => {
        if (!clientSecret) return null;
        return {
            clientSecret,
            appearance: { theme: 'stripe' },
			elements: {
              wallets: {
                link: 'never',
              },
            },
        };
    }, [clientSecret]);

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
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la validation.');
        } finally {
            setLoading(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Votre panier est vide</h2>
                <button onClick={() => navigate('/produits')}>Continuer les achats</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Récapitulatif de la commande</h1>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {cartItems.map((item) => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.8rem 0' }}>
                        <span>{item.title || item.name} (x{item.quantity || 1})</span>
                        <span>{(item.price * (item.quantity || 1)).toFixed(2)} €</span>
                    </li>
                ))}
            </ul>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', margin: '1rem 0' }}>
                <span>Total :</span>
                <span>{total.toFixed(2)} €</span>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!clientSecret ? (
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? 'Traitement en cours...' : `Payer ${total.toFixed(2)} €`}
                </button>
            ) : (
                options && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm
                            clientSecret={clientSecret}
                            onSuccess={() => {
                                if (clearCart) clearCart();
                                navigate('/profile');
                            }}
                        />
                    </Elements>
                )
            )}
        </div>
    );
}