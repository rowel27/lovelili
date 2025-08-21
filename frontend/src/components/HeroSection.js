import React from 'react';
import './HeroSection.css';
import heroImage from '../assets/IMG_3965.PNG';
import { useNavigate } from 'react-router-dom';


const HeroSection = () => {

  const navigate = useNavigate();

  const onClickShopNow = () => {
    navigate('/products'); 
  // ✅ client-side navigation
  };

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
