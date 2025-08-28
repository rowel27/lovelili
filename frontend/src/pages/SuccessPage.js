import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const SuccessPage = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);
    
    
    return (
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order is being processed.</p>
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

export default SuccessPage;
