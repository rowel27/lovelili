import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  console.log(product)


  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card-wrapper">
      <div className="product-card" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className={`product-image-wrapper ${product.is_sold ? "sold" : ""}`}>
          <img
            className="product-image"
            src={product.image_url || "https://via.placeholder.com/500x500?text=No+Image"}
            alt={product.name || product.title}
          />
          {product.is_sold && <div className="sold-badge">Sold</div>}
          
        </div>

        <div className="product-details">
          <h4 className="product-title">{product.name || product.title}</h4>
          <h4 className="product-price">${product.price}</h4>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

