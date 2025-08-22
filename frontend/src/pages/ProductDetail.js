import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductDetail.css';



const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {cart, addToCart } = useCart();
  const isInCart = product ? cart.some(item => item.id === product.id) : false;
  const navigate = useNavigate();


  const handleCartClick = () => {
    if (isInCart) {
      navigate('/cart'); // Redirect to checkout page
    } else {
      addToCart(product);
    }
  };

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
    setCurrentImageIndex(0); // Reset image index when product changes
  }, [id]);

  // Combine main image and additional images into one array
  const getAllImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image) images.push({ id: 'main', image: product.image });
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => images.push(img));
    }
    return images;
  };
  const allImages = getAllImages();



  // Handlers for navigation
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  const handleThumbnailClick = (idx) => {
    setCurrentImageIndex(idx);
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
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span> &gt; </span>

          <Link to="/products/all">Products</Link>
          <span> &gt; </span>

          <span>{product.name}</span>
        </nav>
        <div className="product-detail">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-swipe-wrapper">
              <button className="swipe-arrow left" onClick={goToPrevImage} aria-label="Previous image">&#8592;</button>
              <div className="product-image">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[currentImageIndex].image}
                    alt={product.name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/500x600?text=Product+Image'; }}
                  />
                ) : (
                  <div className="placeholder-image">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              <button className="swipe-arrow right" onClick={goToNextImage} aria-label="Next image">&#8594;</button>
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="product-gallery">
                {allImages.map((img, idx) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={product.name + ' gallery'}
                    className={`gallery-image${idx === currentImageIndex ? ' active' : ''}`}
                    onClick={() => handleThumbnailClick(idx)}
                    onError={e => { e.target.src = 'https://via.placeholder.com/100x100?text=Image'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-price">{product.price}</div>
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
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleCartClick}
                  disabled={product.is_sold}
                >
                  {product.is_sold ? "Sold Out" :isInCart ? "Proceed to Checkout" : "Add to Cart"}
                </button>
              </div>


            <div className="product-status">
              {product.is_sold ? (
                <div></div>
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