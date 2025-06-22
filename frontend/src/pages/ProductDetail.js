import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getProduct(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found or error loading product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <Link to="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image">
              {product.image ? (
                <img 
                  src={`http://localhost:8000${product.image}`} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x600?text=Product+Image';
                  }}
                />
              ) : (
                <div className="placeholder-image">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-price">{formatPrice(product.price)}</div>
            </div>

            <div className="product-meta">
              {product.category && (
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category.name}</span>
                </div>
              )}
              
              {product.drop && (
                <div className="meta-item">
                  <span className="meta-label">Drop:</span>
                  <span className="meta-value">
                    <Link to="/drops" className="drop-link">
                      {product.drop.name}
                    </Link>
                  </span>
                </div>
              )}
              
              <div className="meta-item">
                <span className="meta-label">Added:</span>
                <span className="meta-value">{formatDate(product.created_at)}</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-actions">
              <button className="btn btn-primary btn-large">
                Add to Cart
              </button>
              <button className="btn btn-secondary btn-large">
                Add to Wishlist
              </button>
            </div>

            <div className="product-status">
              {product.is_sold ? (
                <div className="status-badge sold">Sold Out</div>
              ) : (
                <div className="status-badge available">Available</div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="related-products">
          <h2>You might also like</h2>
          <p>Check out similar products from our collection</p>
          <Link to="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 