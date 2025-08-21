import React from 'react';
import { Link } from 'react-router-dom';
import './DropCard.css'; // You'll need to create this CSS file

const DropCard = ({ drop, isAllCard = false }) => {
  const linkTo = isAllCard
  ? '/products/all'
  : `/products/drop/${drop.id}`; // note the 'drop' segment

  
  return (
    <Link to={linkTo} className="drops-card">
      <div className="drops-card-image">
        {isAllCard ? (
          // You can use a default "All Products" image or icon
          <div className="all-products-placeholder">
            <span>All Products</span>
          </div>
        ) : (
          // You'll need to add an image field to your Drop model
          <img 
            src={drop.image || '/default-drop-image.jpg'} 
            alt={drop.name}
          />
        )}
      </div>
      
      <div className="drops-card-content">
        <h3 className="drops-card-title">
          {isAllCard ? 'All Products' : drop.name}
        </h3>
        
        <p className="drops-card-description">
          {isAllCard 
            ? 'Browse all available products from every drop' 
            : drop.description
          }
        </p>
        
        {!isAllCard && drop.drop_date && (
          <p className="drops-card-date">
            Released: {new Date(drop.drop_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
};

export default DropCard;