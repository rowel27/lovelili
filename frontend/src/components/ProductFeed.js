import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductCard from './ProductCard';
import './ProductFeed.css';

const ProductFeed = ({ showFilters = false }) => {
  const { dropId } = useParams(); // 'all' or a specific drop ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');

  // Function to fetch products (works for all drops or a specific drop)
  const fetchProducts = useCallback(async (ordering = sortOption) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const params = ordering ? { ordering } : {};

      if (dropId && dropId !== 'all') {
        // Fetch products for a specific drop
        response = await apiService.getProductsByDrop(dropId, params);
      } else {
        // Fetch all products
        response = await apiService.getProducts(params);
      }

      // Format products consistently
      const formatted = response.data.map((p) => ({
        id: p.id,
        title: p.name || p.title,
        image: p.imageUrl || p.image || '/default-product.jpg',
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        is_sold: p.is_sold === true,
        drop: p.drop || p.collection || 'general',
      }));

      setProducts(formatted);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [dropId, sortOption]);

  // Fetch products on mount and whenever dropId or sortOption changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getDropDisplayName = () => {
    if (!dropId || dropId === 'all') return 'All Products';
    return `Drop ${""}`; // <--- here
  };
  
  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>

      {/* Sorting buttons */}
      <div className="sort-buttons">
        <span>Sort by:</span>
        {[
          { label: 'Available', value: 'is_sold' },
          { label: 'Sold', value: '-is_sold' },
          { label: 'Price (Low to High)', value: 'price' },
          { label: 'Price (High to Low)', value: '-price' },
        ].map(({ label, value }) => (
          <button
            key={value}
            className={sortOption === value ? 'active' : ''}
            onClick={() => setSortOption(value)}
            type="button"
          >
            {label}
          </button>
        ))}
        {/* Drop header */}
        {dropId && dropId !== 'all' && (
          <div className="drop-header">
            <h1>{getDropDisplayName}</h1>
          </div>
      )}
      </div>

      {/* Product grid */}
      <div className={`product-feed-grid-container ${showFilters ? 'with-filters' : ''}`}>
        <div className="product-feed-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="no-products">No products found</div>
      )}
    </>
  );
};

export default ProductFeed;
