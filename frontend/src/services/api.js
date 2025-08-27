import axios from 'axios';

const API_BASE_URL = 'https://lovelili.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const apiService = {
  // Update all these paths to include /api/
  getDrops: () => api.get('/api/drops/'),
  getCurrentDrop: () => api.get('/api/drops/current/'),
  getDrop: (id) => api.get(`/api/drops/${id}/`),
  
  getCategories: () => api.get('/api/categories/'),
  getCategory: (id) => api.get(`/api/categories/${id}/`),
  
  getProducts: (params = {}) => api.get('/api/products/', { params }),
  getProduct: (id) => api.get(`/api/products/${id}/`),
  getProductsByCategory: (categoryId, params = {}) =>
    api.get('/api/products/', { params: { category: categoryId, ...params } }),
  getProductsByDrop: (dropId, params = {}) =>
    api.get('/api/products/', { params: { drop: dropId, ...params } }),
};

export default api;