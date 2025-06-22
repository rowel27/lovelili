import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-text">LoveLili</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/drops" 
            className={`navbar-link ${isActive('/drops') ? 'active' : ''}`}
          >
            Current Drop
          </Link>
          <Link 
            to="/previous-drops" 
            className={`navbar-link ${isActive('/previous-drops') ? 'active' : ''}`}
          >
            Previous Drops
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        <div className={`navbar-mobile ${isMenuOpen ? 'open' : ''}`}>
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
            Current Drop
          </Link>
          <Link 
            to="/previous-drops" 
            className={`navbar-link ${isActive('/previous-drops') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Previous Drops
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 