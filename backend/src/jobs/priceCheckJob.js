const Product = require('../models/Product');
const PriceAlert = require('../models/PriceAlert');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { fetchProductDetails } = require('../services/scraperService');
const { sendEmail } = require('../services/emailService');
const { sendBrowserNotification } = require('../services/pushNotificationService');
const { priceCheckQueue, notificationQueue } = require('./queues');

const checkProductPrices = async () => {
  try {
    console.log('Starting price check job...');

    // Get all active products
    const products = await Product.find({});

    for (const product of products) {
      try {
        // Fetch current price
        const productData = await fetchProductDetails(product.url);

        if (!productData) continue;

        const currentPrice = productData.price;
        const previousPrice = product.currentPrice;
        const priceChanged = currentPrice !== previousPrice;

        if (priceChanged) {
          // Update product price
          product.currentPrice = currentPrice;
          product.inStock = productData.inStock;
          product.lastUpdated = new Date();
          product.priceHistory.push({
            price: currentPrice,
            date: new Date(),
          });
          await product.save();

          // Check alerts
          await checkAndTriggerAlerts(product, previousPrice);
        }
      } catch (error) {
        console.error(`Error checking product ${product._id}:`, error.message);
      }
    }

    console.log('Price check job completed');
  } catch (error) {
    console.error('Error in price check job:', error);
  }
};

const checkAndTriggerAlerts = async (product, previousPrice) => {
  try {
    const alerts = await PriceAlert.find({
      productId: product._id,
      isActive: true,
      triggered: false,
    });

    for (const alert of alerts) {
      let shouldTrigger = false;
      let message = '';

      switch (alert.alertType) {
        case 'price_drop':
          shouldTrigger = product.currentPrice < previousPrice;
          message = `Price dropped from ₹${previousPrice} to ₹${product.currentPrice}!`;
          break;

        case 'percentage_drop':
          const percentageDrop =
            ((previousPrice - product.currentPrice) / previousPrice) * 100;
          shouldTrigger = percentageDrop >= alert.percentageDrop;
          message = `Price dropped by ${percentageDrop.toFixed(1)}%!`;
          break;

        case 'price_target':
          shouldTrigger = product.currentPrice <= alert.targetPrice;
          message = `Price reached your target of ₹${alert.targetPrice}!`;
          break;

        case 'back_in_stock':
          shouldTrigger = product.inStock === true;
          message = `Product is back in stock!`;
          break;
      }

      if (shouldTrigger) {
        // Create notification record
        const notification = new Notification({
          userId: product.userId,
          productId: product._id,
          alertId: alert._id,
          type: 'email',
          title: `${product.name} - Price Alert`,
          message: message,
          data: {
            currentPrice: product.currentPrice,
            previousPrice: previousPrice,
            targetPrice: alert.targetPrice,
          },
          status: 'pending',
        });

        await notification.save();

        // Queue notification job
        await notificationQueue.add(
          {
            notificationId: notification._id,
            productId: product._id,
            userId: product.userId,
            message,
          },
          { attempts: 3, backoff: 'exponential' }
        );

        // Mark alert as triggered
        alert.triggered = true;
        alert.triggeredAt = new Date();
        await alert.save();
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};

const schedulePriceChecks = () => {
  // Use environment variable or default to 6 hours
  const interval = parseInt(process.env.PRICE_CHECK_INTERVAL || '21600000', 10);
  console.log(`Price check scheduled every ${interval / 1000 / 60} minutes`);
  
  setInterval(() => {
    checkProductPrices();
  }, interval);

  // Run immediately on startup
  checkProductPrices();
};

module.exports = {
  checkProductPrices,
  schedulePriceChecks,
  checkAndTriggerAlerts,
};
