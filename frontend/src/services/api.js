import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getDrops: () => api.get('/drops/'),
  getCurrentDrop: () => api.get('/drops/current/'),
  getDrop: (id) => api.get(`/drops/${id}/`),
  getCategories: () => api.get('/categories/'),
  getCategory: (id) => api.get(`/categories/${id}/`),
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  getProductsByCategory: (categoryId) => api.get('/products/', { params: { category: categoryId } }),
  getProductsByDrop: (dropId) => api.get('/products/', { params: { drop: dropId } }),
};

export default api;
