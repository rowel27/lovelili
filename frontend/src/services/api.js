import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Drops
  getDrops: () => api.get('/drops/'),
  getCurrentDrop: () => api.get('/drops/current/'),
  getDrop: (id) => api.get(`/drops/${id}/`),

  // Categories
  getCategories: () => api.get('/categories/'),
  getCategory: (id) => api.get(`/categories/${id}/`),

  // Products
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  getProductsByCategory: (categoryId) => api.get('/products/', { params: { category: categoryId } }),
  getProductsByDrop: (dropId) => api.get('/products/', { params: { drop: dropId } }),
};

export default api; 