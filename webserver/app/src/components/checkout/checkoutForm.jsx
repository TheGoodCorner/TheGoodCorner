import React, { useState, useMemo } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useProductStore } from '../../stores/productStore';
import { useThemeStore } from '../../stores/themeStore'; // 👈 Importe ton store thème

export default function CheckoutForm({ onSuccess, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { fetchProducts } = useProductStore();
  const theme = useThemeStore((state) => state.theme); // 👈 Récupère le thème actuel

  // Récupère les couleurs CSS dynamiques
  const cardOptions = useMemo(() => {
    const root = document.documentElement;
    const colorText = getComputedStyle(root).getPropertyValue('--color-text').trim();
    const colorTextMuted = getComputedStyle(root).getPropertyValue('--color-text-muted').trim();

    return {
      hidePostalCode: false,
      style: {
        base: {
          color: colorText,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: colorTextMuted,
          },
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
      },
    };
  }, [theme]); // 👈 Régénère quand le thème change

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      if (fetchProducts) await fetchProducts();
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
        <CardElement options={cardOptions} />
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
