import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CancelPage = () => {
  const { cart, clearCart } = useCart();

  useEffect(() => {
    console.log('CancelPage component mounted');
    console.log('CancelPage mounted, cart length:', cart.length);
    if (cart.length > 0) {
      const productIds = cart.map(item => item.id); // frontend product IDs
      console.log('Canceling reservation for products:', productIds);
      fetch("https://lovelili.onrender.com/api/cancel-reservation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_ids: productIds }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to cancel reservation');
        }
        return response.json();
      })
      .then(() => {
        clearCart(); // also clear the frontend cart
      })
      .catch(error => {
        console.error('Error canceling reservation:', error);
        // Still clear the cart even if the API call fails
        clearCart();
      });
    } else {
      // If cart is empty, just clear it
      clearCart();
    }
  }, [cart, clearCart]);

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>Payment Canceled</h1>
      <p>Your payment was canceled. You can try again or continue browsing.</p>
      <Link
        to="/"
        style={{
          marginTop: '20px',
          display: 'inline-block',
          textDecoration: 'none',
          background: '#000',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '6px',
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default CancelPage;
