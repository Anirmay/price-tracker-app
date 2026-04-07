import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productService = {
  addProduct: (data) => api.post('/products', data),
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const alertService = {
  createAlert: (data) => api.post('/alerts', data),
  getAlerts: () => api.get('/alerts'),
  updateAlert: (id, data) => api.put(`/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  subscribeToPush: (subscription) => api.post('/notifications/push/subscribe', { subscription }),
  unsubscribeFromPush: (endpoint) => api.post('/notifications/push/unsubscribe', { endpoint }),
};

export default api;
