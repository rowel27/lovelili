import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';
import defaultImage from '../assets/allProducts.jpeg'
import './ProductFeed.css';

const ProductFeed = ({ showFilters = false }) => {
  const { dropId } = useParams(); // 'all' or a specific drop ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [dropName, setDropName] = useState('All Products');
  const [dropImage, setDropImage] = useState(''); // Store drop background image
  const [categoryFilter, setCategoryFilter] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering

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
        const firstProduct = response.data[0];
        if (firstProduct?.drop) {
          setDropName(firstProduct.drop.name || `Drop ${dropId}`);
          // Get the featured_image from the drop object
          setDropImage(firstProduct.drop.featured_image || '');
        } else {
          setDropName(`Drop ${dropId}`);
          setDropImage('');
        }
      } else {
        // Fetch all products
        response = await apiService.getProducts(params);
        setDropName('All Products');
        setDropImage(defaultImage); // No specific drop image for "all products"
      }

      // Format products consistently
      const formatted = response.data.map((p) => ({
        id: p.id,
        title: p.name || p.title,
        image: p.image || '/default-product.jpg',
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        is_sold: p.is_sold === true,
        drop: p.drop?.name || p.collection?.name || p.collection || 'general',
        category: p.category?.name || p.type?.name || p.product_type?.name || p.category || p.type || p.product_type || 'uncategorized',
      }));

      setAllProducts(formatted);
      setProducts(formatted);

      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [dropId, sortOption]);

  // Filter products by category
  const filterProductsByCategory = useCallback(() => {
    let filtered = [...allProducts];
    
    if (categoryFilter && categoryFilter !== '') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setProducts(filtered);
  }, [allProducts, categoryFilter]);

  // Fetch products on mount and whenever dropId or sortOption changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products whenever category filter changes
  useEffect(() => {
    filterProductsByCategory();
  }, [filterProductsByCategory]);

  const categories = Array.from(new Set(allProducts.map(p => p.category))).sort();
  
  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    {/* Drop header with featured image background */}
    <div 
      className="drop-header" 
      style={{ 
        backgroundImage: `url(${dropId === "all" ? defaultImage : dropImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="overlay"></div>
      </div>

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

        {/* Category Filter Dropdown */}
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span> &gt; </span>
          <span>{dropName}</span>
        </nav>

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