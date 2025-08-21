import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';
import cartIcon from '../assets/cart-icon.png'; // or .svg

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <span className="brand-text">LoveLiLi</span>
        </Link>

        <button
          className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/drops"
            className={`navbar-link ${isActive('/drops') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="navbar-link cart-link"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cart"
          >
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;