const Bull = require('bull');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  username: process.env.REDIS_USERNAME || 'default',
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const priceCheckQueue = new Bull('price-check', redisConfig);

const notificationQueue = new Bull('send-notification', redisConfig);

// Process price check jobs
priceCheckQueue.process(async (job) => {
  console.log('Processing price check job:', job.id);
  // Price checking logic will be added here
});

// Process notification jobs
notificationQueue.process(async (job) => {
  console.log('Processing notification job:', job.id);
  // Notification sending logic will be added here
});

// Error handlers
priceCheckQueue.on('failed', (job, error) => {
  console.error('Price check job failed:', job.id, error);
});

notificationQueue.on('failed', (job, error) => {
  console.error('Notification job failed:', job.id, error);
});

module.exports = {
  priceCheckQueue,
  notificationQueue,
};
