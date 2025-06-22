import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './PreviousDrops.css';

const PreviousDrops = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrop, setSelectedDrop] = useState(null);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrops();
        // Filter to show only past drops (not live ones)
        const pastDrops = response.data.filter(drop => !drop.is_live);
        setDrops(pastDrops);
      } catch (error) {
        console.error('Error fetching drops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDropImage = (dropName) => {
    // Generate placeholder images based on drop name
    const imageMap = {
      'Summer Elegance Collection': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      'Golden Hour Essentials': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop',
      'Bohemian Dreams': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
    };
    return imageMap[dropName] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop';
  };

  const handleDropClick = (drop) => {
    setSelectedDrop(drop);
  };

  const closeModal = () => {
    setSelectedDrop(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading previous drops...
      </div>
    );
  }

  return (
    <div className="previous-drops-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Previous Drops</h1>
          <p>Explore our past collections and exclusive drops</p>
        </div>

        {/* Drops Gallery */}
        <div className="drops-gallery">
          {drops.map((drop) => (
            <div 
              key={drop.id} 
              className="drop-card"
              onClick={() => handleDropClick(drop)}
            >
              <div className="drop-image">
                <img 
                  src={getDropImage(drop.name)} 
                  alt={drop.name}
                  loading="lazy"
                />
                <div className="drop-overlay">
                  <div className="drop-info">
                    <h3>{drop.name}</h3>
                    <p className="drop-date">{formatDate(drop.drop_date)}</p>
                    <span className="view-collection">View Collection</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Drops Message */}
        {drops.length === 0 && (
          <div className="no-drops">
            <div className="no-drops-content">
              <h3>No Previous Drops</h3>
              <p>We haven't had any drops yet. Check back soon for our first collection!</p>
              <Link to="/drops" className="btn btn-primary">
                View Current Drops
              </Link>
            </div>
          </div>
        )}

        {/* Drop Detail Modal */}
        {selectedDrop && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <div className="modal-header">
                <img 
                  src={getDropImage(selectedDrop.name)} 
                  alt={selectedDrop.name}
                  className="modal-image"
                />
                <div className="modal-info">
                  <h2>{selectedDrop.name}</h2>
                  <p className="modal-date">{formatDate(selectedDrop.drop_date)}</p>
                  <p className="modal-description">{selectedDrop.description}</p>
                </div>
              </div>

              <div className="modal-actions">
                <Link to={`/drops`} className="btn btn-primary">
                  View Products
                </Link>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousDrops; 