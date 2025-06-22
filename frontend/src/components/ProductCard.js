import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image">
          {product.image ? (
            <img 
              src={`http://localhost:8000${product.image}`} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400?text=Product+Image';
              }}
            />
          ) : (
            <div className="placeholder-image">
              <span>No Image</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          
          <div className="product-meta">
            <span className="product-category">{product.category?.name}</span>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>
          
          {product.drop && (
            <div className="product-drop">
              <span className="drop-badge">{product.drop.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 