import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import DropCard from '../components/DropCard';
import './DropPage.css'; // You'll need to create this CSS file

const DropPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrops();
  }, []);

  const fetchDrops = async () => {
    try {
      const response = await apiService.getDrops();
      setDrops(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="drops-page">
        <div className="loading">Loading drops...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="drops-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="drops-page">
      <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span>Drops</span>

        </nav>
      <div className="drops-header">
        <h1>Choose a Collection</h1>
        <p>Browse products by drop or see everything we have available</p>
      </div>
      
      <div className="drops-grid">
        {/* Always show "All Products" card first */}
        <DropCard isAllCard={true} />
        
        {/* Then show all the actual drops */}
        {drops.map(drop => (
          <DropCard 
            key={drop.id} 
            drop={drop} 
          />
        ))}
      </div>
    </div>
  );
};

export default DropPage;