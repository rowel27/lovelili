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
              src={product.image}
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
          <p className="productprice">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 