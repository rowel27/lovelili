import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);


  const handleCheckout = () => {
    navigate('/checkout');
  };


  if (cart.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Your Cart</h1>
      <ul className="cart-items">
        {cart.map((product) => (
          <li key={product.id} className="cart-item">
            <div className="item-info">
              <h3>{product.name}</h3>
              <h3>{product.price}</h3>
            </div>
            <button
              className="btn btn-danger btn-small"
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <h3>Total: {totalPrice}</h3>
        <button className="btn btn-primary btn-large" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
        <button
          className="btn btn-secondary btn-small"
          onClick={clearCart}
          style={{ marginLeft: '10px' }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
