import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { createPayment } from '../api/paymentApi';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import CheckoutForm from '../components/checkout/checkoutForm';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  CreditCard,
  Loader,
  Lock,
  AlertCircle,
  ArrowLeft,
  Package,
} from 'lucide-react';

loadStripe.setLoadParameters({ advancedFraudSignals: false });
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const ELEMENTS_OPTIONS = {
  appearance: { theme: 'stripe' },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export default function Checkout() {
  console.log('RENDER CHECKOUT');
  const navigate = useNavigate();
  const { cartItems, clearCart, isHydrated } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const total =
    cartItems?.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) || 0;

  if (!isHydrated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader size={48} className="text-[var(--color-primary)]" />
          </motion.div>
          <p className="text-[var(--color-text-muted)]">Chargement du panier...</p>
        </div>
      </motion.div>
    );
  }

  const handleCheckout = async () => {
    try {

        if (!isAuthenticated)
        {
            setError('Vous devez être connecté pour passer votre commande.');
            return
        }
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] p-6"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            className="mb-6"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ShoppingCart size={64} className="text-[var(--color-primary)] mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            Votre panier est vide
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Découvrez nos produits et commencez à faire vos achats
          </p>
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] rounded-lg font-semibold transition-colors"
          >
            Continuer les achats
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[var(--color-bg)] p-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.button
            onClick={() => navigate('/products')}
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour
          </motion.button>
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            Récapitulatif de commande
          </h1>
        </motion.div>

        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 shadow-lg backdrop-blur-sm"
        >
          {/* Items List */}
          <motion.div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Package size={24} className="text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Articles ({cartItems.length})
              </h2>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-4 bg-[var(--color-surface-hover)] rounded-xl hover:bg-[var(--color-border)] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-text)]">
                        {item.title || item.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Quantité: <span className="font-semibold">{item.quantity || 1}</span>
                      </p>
                    </div>
                    <motion.div
                      className="text-lg font-semibold text-[var(--color-primary)]"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      {(item.price * (item.quantity || 1)).toFixed(2)} €
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent my-8"
          />

          {/* Total */}
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-8"
          >
            <span className="text-xl font-semibold text-[var(--color-text)]">Total :</span>
            <motion.span
              className="text-3xl font-bold text-[var(--color-primary)]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {total.toFixed(2)} €
            </motion.span>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-[var(--color-danger-surface)] border border-[var(--color-danger)] rounded-lg flex items-start gap-3"
                >
                <AlertCircle size={20} className="text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-[var(--color-danger)] font-medium mb-3">{error}</p>
                    {!isAuthenticated && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/authentication')}
                        className="px-4 py-2 bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                        Se connecter
                    </motion.button>
                    )}
                </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Section */}
          <AnimatePresence mode="wait">
            {!clientSecret ? (
              <motion.button
                key="payment-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] hover:shadow-lg text-[var(--color-on-primary)] py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Loader size={20} />
                    </motion.div>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Payer {total.toFixed(2)} €</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="checkout-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      if (clearCart) clearCart();
                      navigate('/checkout/success');
                    }}
                  />
                </Elements>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-[var(--color-text-muted)] flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          <p>Paiement sécurisé avec Stripe • Données chiffrées • 100% confidentiel</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
