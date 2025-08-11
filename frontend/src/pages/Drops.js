import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './Drops.css';

const Drops = () => {
  const [drops, setDrops] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [dropProducts, setDropProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrops();
        setDrops(response.data);
        
        // If there's a current live drop, select it by default
        const currentDrop = response.data.find(drop => drop.is_live);
        if (currentDrop) {
          setSelectedDrop(currentDrop);
          const productsResponse = await apiService.getProductsByDrop(currentDrop.id);
          setDropProducts(productsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching drops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, []);

  const handleDropSelect = async (drop) => {
    setSelectedDrop(drop);
    try {
      const response = await apiService.getProductsByDrop(drop.id);
      setDropProducts(response.data);
    } catch (error) {
      console.error('Error fetching drop products:', error);
      setDropProducts([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getProductImage = (productName) => {
    // Generate placeholder images based on product name
    const imageMap = {
      'Luna Moonstone Pendant': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      'Golden Chain Statement Necklace': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop',
      'Bohemian Crystal Choker': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
      'Pearl Drop Earrings': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=600&fit=crop',
      'Geometric Gold Hoops': 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=600&fit=crop',
      'Handmade Clay Earrings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop',
    };
    return imageMap[productName] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop';
  };

  const handlePurchase = (product) => {
    // TODO: Implement purchase functionality
    console.log('Purchase clicked for:', product.name);
    alert(`Purchase functionality coming soon for ${product.name}!`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading drops...
      </div>
    );
  }

  return (
    <div className="drops-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Current Drop</h1>
          <p>Explore our exclusive fashion drops and collections</p>
        </div>

        {/* Drops Grid */}
        <div className="drops-grid">
          {drops.map((drop) => (
            <div 
              key={drop.id} 
              className={`drop-card ${selectedDrop?.id === drop.id ? 'selected' : ''}`}
              onClick={() => handleDropSelect(drop)}
            >
              <div className="drop-header">
                <h3>{drop.name}</h3>
                {drop.is_live && <span className="live-badge">Live Now</span>}
              </div>
              
              <p className="drop-description">{drop.description}</p>
              
              <div className="drop-meta">
                <div className="drop-date">
                  <span className="meta-label">Drop Date:</span>
                  <span className="meta-value">{formatDate(drop.drop_date)}</span>
                </div>
                
                <div className="drop-created">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(drop.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Drop Products */}
        {selectedDrop && (
          <div className="selected-drop-products">
            <div className="section-header">
              <h2>{selectedDrop.name} - Products</h2>
              <p>{selectedDrop.description}</p>
            </div>
            
            {dropProducts.length > 0 ? (
              <div className="products-gallery">
                {dropProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].image}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=Product+Image';
                          }}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/800x600?text=Product+Image"
                          alt={product.name}
                          loading="lazy"
                        />
                      )}
                      <div className="product-overlay">
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="product-price">{formatPrice(product.price)}</p>
                          <p className="product-description">
                            {product.description.length > 100 
                              ? `${product.description.substring(0, 100)}...` 
                              : product.description
                            }
                          </p>
                          {product.category && (
                            <div className="product-category">
                              {product.category.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="btn-purchase"
                      onClick={() => handlePurchase(product)}
                    >
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products in this drop</h3>
                <p>This drop doesn't have any products yet.</p>
              </div>
            )}
          </div>
        )}

        {/* No Drops Message */}
        {drops.length === 0 && (
          <div className="no-drops">
            <h3>No drops available</h3>
            <p>Check back later for new drops and collections.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drops; 