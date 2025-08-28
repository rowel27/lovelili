import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CancelPage = () => {
  const { cart, clearCart } = useCart();

  useEffect(() => {
    if (cart.length > 0) {
      const productIds = cart.map(item => item.id); // frontend product IDs
      fetch("https://lovelili-1.onrender.com/api/cancel-reservation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_ids: productIds }),
      }).then(() => {
        clearCart(); // also clear the frontend cart
      });
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
