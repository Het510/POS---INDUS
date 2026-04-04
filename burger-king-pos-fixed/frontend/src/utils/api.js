import axios from 'axios';

// Auto-detect API URL so the app works on any device on the local network.
// If REACT_APP_API_URL is set in .env, use that.
// Otherwise use the same hostname as the browser (works when accessed from other laptops).
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return `http://${window.location.hostname}:5000/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bk_token');
      localStorage.removeItem('bk_user');
    }
    return Promise.reject(err);
  }
);

export default API;

// Auth
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Products
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
};

// Orders
export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getAll: (params) => API.get('/orders', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  getMyOrders: () => API.get('/orders/my-orders'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  updatePayment: (id, data) => API.put(`/orders/${id}/payment`, data),
  sendToKitchen: (id) => API.put(`/orders/${id}/send-kitchen`),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
};

// Tables
export const tablesAPI = {
  getAll: () => API.get('/tables'),
  create: (data) => API.post('/tables', data),
  update: (id, data) => API.put(`/tables/${id}`, data),
  getByToken: (token) => API.get(`/tables/by-token/${token}`),
};

// Offers
export const offersAPI = {
  getAll: () => API.get('/offers'),
  validate: (data) => API.post('/offers/validate', data),
};

// Payments
export const paymentsAPI = {
  generateUPIQR: (data) => API.post('/payments/upi-qr', data),
  createRazorpay: (data) => API.post('/payments/create-razorpay', data),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

// Kitchen
export const kitchenAPI = {
  getOrders: () => API.get('/kitchen/orders'),
  updateItem: (orderId, itemIndex, status) =>
    API.put(`/kitchen/orders/${orderId}/items/${itemIndex}`, { kitchenStatus: status }),
};
