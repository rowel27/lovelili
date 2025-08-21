import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ProductCard from './ProductCard';
import './ProductFeed.css';
import { useCallback } from 'react';

const ProductFeed = ({ products: propProducts, showFilters = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');


const fetchProducts = useCallback(async (ordering = '') => {
  try {
    setLoading(true);
    const response = await apiService.getProducts(ordering ? { ordering } : {});
    setProducts(formatProducts(response.data));
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    if (propProducts) {
      setProducts(formatProducts(propProducts));
      setLoading(false);
    } else {
      fetchProducts(sortOption);
    }
  }, [propProducts, sortOption, fetchProducts]);

  const formatProducts = (data) => {
    return data.map((p) => ({
      id: p.id,
      title: p.name || p.title,
      image: p.imageUrl || p.image,
      price: p.price,
      compareAtPrice: p.compareAtPrice || null,
      is_sold: p.is_sold === true,
    }));
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
    <>
    <div className="sort-buttons">
      <span>Sort by:</span>
      {[
        { label: 'Available', value: 'is_sold' },
        { label: 'Sold', value: '-is_sold' },
        { label: 'Price (Low to High)', value: 'price' },
        { label: 'Price (High to Low)', value: '-price' },
      ].map(({ label, value }) => (
        <button
          key={value || 'default'}
          className={sortOption === value ? 'active' : ''}
          onClick={() => setSortOption(value)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
      <div className={`product-feed-grid-container ${showFilters ? 'with-filters' : ''}`}>
        <div className="product-feed-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );  
};

export default ProductFeed;
