import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import React from 'react';

const PaymentForm = ({ planName, planAmount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentIntent } = await stripe.confirmCardPayment('{client_secret}', {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.error(error);
    } else {
      console.log('Payment succeeded:', paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay {planAmount}</button>
    </form>
  );
};
