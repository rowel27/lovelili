import React from 'react';
import './HeroSection.css';
import heroImage from '../assets/IMG_3965.PNG';

const onClickShopNow = () => {
  window.location.href = '/products'; // Redirect to products page
};

const HeroSection = () => {
  return (
    <div 
      className="hero-section"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-overlay">
        <h1 className="hero-title">LoveLiLi</h1>
        <p className="hero-subtitle">Discover unique products and exclusive drops</p>
        <button className="hero-button" onClick={onClickShopNow}>Shop Now</button>
      </div>
    </div>
  );
};

export default HeroSection;
