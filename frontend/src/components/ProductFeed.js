import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './ProductFeed.css';

const ProductFeed = ({ products: propProducts, showFilters = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (propProducts) {
      // If products are passed as props, use them directly
      setProducts(propProducts);
      setLoading(false);
    } else {
      // Otherwise fetch all products
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await apiService.getProducts();
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [propProducts]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handlePurchase = (product) => {
    // TODO: Implement purchase functionality
    console.log('Purchase clicked for:', product.name);
    alert(`Purchase functionality coming soon for ${product.name}!`);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h2>No products available</h2>
        <p>Check back later for new arrivals.</p>
      </div>
    );
  }

  return (
    <div className={`product-feed-container ${showFilters ? 'with-filters' : ''}`} onScroll={handleScroll}>
      <div className="product-feed">
        {products.map((product, index) => (
          <div key={product.id} className="product-slide">
            <img 
              src={product.image ? `http://localhost:8000${product.image}` : 'https://via.placeholder.com/800x1200?text=Product+Image'} 
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x1200?text=Product+Image';
              }}
            />
            
            <div className="product-overlay">
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <div className="product-price">{formatPrice(product.price)}</div>
                <p className="product-description">
                  {product.description.length > 150 
                    ? `${product.description.substring(0, 150)}...` 
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
            
            <button 
              className="btn-purchase"
              onClick={() => handlePurchase(product)}
              aria-label={`Purchase ${product.name}`}
            >
              Purchase Now
            </button>
          </div>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ height: `${((currentIndex + 1) / products.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {currentIndex + 1} / {products.length}
        </div>
      </div>
    </div>
  );
};

export default ProductFeed; 