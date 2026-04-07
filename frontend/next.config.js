const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://price-tracker-api.onrender.com/api'
        : 'http://localhost:5003/api'
    ),
  },
};

module.exports = nextConfig;
