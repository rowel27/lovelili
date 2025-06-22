import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
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
          onClick={handleMenuToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        <div className={`navbar-mobile ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link 
            to="/drops" 
            className={`navbar-link ${isActive('/drops') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Current Drop
          </Link>
          <Link 
            to="/previous-drops" 
            className={`navbar-link ${isActive('/previous-drops') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Previous Drops
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 