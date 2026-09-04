import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useProductStore } from '../../stores/productStore';

const CARD_OPTIONS = { hidePostalCode: false };
export default function CheckoutForm({ onSuccess, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { fetchProducts } = useProductStore()
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
      if (fetchProducts)
        await fetchProducts();
	  onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <CardElement options={CARD_OPTIONS} />
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