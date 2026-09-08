import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { Wallet } from 'lucide-react';

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { fetchProducts } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stripe.js has not yet loaded.
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required', // Prevents unnecessary page reload if 3DS is not required
    });

    if (error) {
      // Show error to your customer (e.g., payment details incomplete, card declined)
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      if (fetchProducts) await fetchProducts();
      onSuccess();
    }
  };
  const currentUser = useAuthStore((state) => state.user ?? state.currentUser);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
        <PaymentElement options={{
          layout: 'tabs', 
          wallets: {
            applePay: 'never',
            googlePay: 'never',
          },
		  paymentMethodOrder: ['card'],
		  business: { name: 'TheGoodCorner' },
		  fields: {
          billingDetails: {
            email: currentUser?.email,
          }
        }}} />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
      >
        {isProcessing ? 'Validation en cours...' : 'Confirmer le règlement'}
      </button>
    </form>
  );
}