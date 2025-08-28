import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';


const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => {
  const price = Number(item.price) || 0; // convert to number, fallback to 0
  return sum + price;
}, 0);

const handleCheckout = async () => {
  if (cart.length === 0) return alert("Your cart is empty!");

  try {
    const response = await fetch("https://lovelili.onrender.com/api/create-checkout-session/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // redirect to Stripe checkout
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to initiate checkout");
  }
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
              <img
            className="product-image"
            src={product.image || "https://via.placeholder.com/500x500?text=No+Image"}
            alt={product.name ||product || product.title}
          />
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
        <h3>Total: ${totalPrice}</h3>
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
