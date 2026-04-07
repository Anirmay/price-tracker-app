// Production configuration for Next.js
// This file contains settings for production environment

module.exports = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://price-tracker-api.onrender.com/api',
  
  // Session Configuration
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Logging
  DEBUG: process.env.NODE_ENV !== 'production',
};
