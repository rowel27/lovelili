import React from 'react';
import HeroSection from '../components/HeroSection';
// You'll need to create or import a DropsFeed component, or modify this based on how you want to display drops

const Home = () => {
  return (
    <div>
      <HeroSection />
      {/* Replace ProductFeed with drops display */}
      <div className="drops-section">
        <h2>Latest Drops</h2>
        {/* Add your drops content here - you might need a DropsFeed component */}
      </div>
    </div>
  );
};

export default Home;