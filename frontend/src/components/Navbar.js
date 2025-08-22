import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api'; // Make sure you have this
import './Navbar.css';
import cartIcon from '../assets/cart-icon.png'; // or .svg

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drops, setDrops] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
    setIsDropdownOpen(false); // close dropdown on route change
  }, [location]);

  // Fetch drops for the dropdown
  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const response = await apiService.getDrops();
        setDrops(response.data);
      } catch (err) {
        console.error('Failed to fetch drops:', err);
      }
    };
    fetchDrops();
  }, []);

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

          {/* Products dropdown */}
          <div className="navbar-dropdown">
            <button
              className={`navbar-link dropdown-toggle ${isActive('/drops') ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Products ▾
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* All Products */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDropdownOpen(false);
                    navigate('/products/all'); // matches DropCard's all products link
                  }}
                >
                  All Products
                </button>

                {/* Map through all drops */}
                {drops.map((drop) => (
                  <button
                    key={drop.id}
                    className="dropdown-item"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDropdownOpen(false);
                      navigate(`/products/drop/${drop.id}`); // matches DropCard link
                    }}
                  >
                    {drop.name}
                  </button>
                ))}
              </div>
            )}
</div>

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
