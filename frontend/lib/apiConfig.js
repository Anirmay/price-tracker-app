// API configuration service for frontend
// Automatically uses the correct API URL based on environment

export const API_CONFIG = {
  // In production (Render), use the backend URL
  // In development, use localhost
  get baseURL() {
    if (typeof window !== 'undefined') {
      // Browser side
      if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
      }
      // Fallback to localhost for development
      return 'http://localhost:5003';
    }
    // Server side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';
  },

  // API Endpoints
  endpoints: {
    auth: '/api/auth',
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
    logout: '/api/auth/logout',
    products: '/api/products',
    alerts: '/api/alerts',
    notifications: '/api/notifications',
    health: '/health',
  },

  // Request timeout (ms)
  timeout: 30000,

  // Retry config
  retries: 3,
  retryDelay: 1000,
};

export default API_CONFIG;
