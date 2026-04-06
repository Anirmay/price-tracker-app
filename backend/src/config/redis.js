const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  username: process.env.REDIS_USERNAME || 'default',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {Pro
  console.log('✅ Redis Client Connected');
});

client.on('reconnecting', () => {
  console.log('🔄 Redis Client Reconnecting...');
});

client.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err);
});

module.exports = client;
