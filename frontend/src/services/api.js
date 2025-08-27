import axios from 'axios';

const API_BASE_URL = 'https://lovelili.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
useEffect(() => {
  apiService.getProducts()
    .then(res => {
      console.log("Fetched products:", res.data);
      setProducts(res.data);
    })
    .catch(err => console.error("Error fetching products:", err));
}, []);
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
  getProductsByCategory: (categoryId, params = {}) =>
    api.get('/products/', { params: { category: categoryId, ...params } }),
  getProductsByDrop: (dropId, params = {}) =>
    api.get('/products/', { params: { drop: dropId, ...params } }),
};


export default api;
