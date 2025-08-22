import React from 'react';
import HeroSection from '../components/HeroSection'; // Assuming you have a CartPage component
import leftImage from '../assets/IMG_9306.jpg'
import rightImage from '../assets/IMG_9310.jpg'
// You'll need to create or import a DropsFeed component, or modify this based on how you want to display drops

const Home = () => {
  return (
    <div>
      <HeroSection />

      {/* Two images side by side */}
      <div className="side-by-side-images" style={{ display: 'flex', width: '100%' }}>
        <img 
          src={leftImage}
          alt="Left" 
          style={{ width: '51%', objectFit: 'cover' }} 
        />
        <img 
          src={rightImage}
          alt="Right" 
          style={{ width: '51%', objectFit: 'cover' }} 
        />
      </div>

      {/* Drops section */}
      <div className="drops-section">
        <h2>New Arrivals</h2>
        {/* Add your drops content here - you might need a DropsFeed component */}
      </div>
    </div>
  );
};

export default Home;