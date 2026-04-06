const Notification = require('../models/Notification');
const User = require('../models/User');
const Product = require('../models/Product');
const { sendEmail } = require('../services/emailService');
const { sendBrowserNotification } = require('../services/pushNotificationService');
const { sendSMS } = require('../services/smsService');

const sendNotifications = async () => {
  try {
    console.log('Processing pending notifications...');

    const pendingNotifications = await Notification.find({
      status: 'pending',
    }).limit(10);

    for (const notification of pendingNotifications) {
      try {
        const user = await User.findById(notification.userId);
        const product = await Product.findById(notification.productId);

        if (!user || !product) continue;

        // Send email if enabled
        if (user.notifications.email) {
          await sendEmail(
            user.email,
            notification.title,
            `
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Current Price:</strong> ₹${notification.data.currentPrice}</p>
            <p><a href="${product.url}" target="_blank">View Product</a></p>
          `
          );
        }

        // Send push notification if enabled
        if (user.notifications.push) {
          await sendBrowserNotification(
            user._id,
            notification.title,
            notification.message,
            {
              productId: product._id.toString(),
              price: notification.data.currentPrice,
            }
          );
        }

        // Send SMS if enabled (and phone number exists)
        if (user.notifications.sms && user.phone) {
          await sendSMS(
            user.phone,
            `${notification.title}: ${notification.message} - ${product.name} is now ₹${notification.data.currentPrice}`
          ).catch((error) => {
            console.error('Failed to send SMS notification:', error);
            // Continue even if SMS fails
          });
        }

        // Update notification status
        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();

        console.log(`Notification sent: ${notification._id}`);
      } catch (error) {
        console.error(
          `Error sending notification ${notification._id}:`,
          error.message
        );

        // Increment retry count
        notification.retryCount += 1;
        notification.error = error.message;

        if (notification.retryCount >= 3) {
          notification.status = 'failed';
        }

        await notification.save();
      }
    }

    console.log('Notification processing completed');
  } catch (error) {
    console.error('Error processing notifications:', error);
  }
};

const scheduleNotifications = () => {
  // Send notifications every 5 minutes
  setInterval(() => {
    sendNotifications();
  }, 5 * 60 * 1000);

  // Run immediately on startup
  sendNotifications();
};

module.exports = {
  sendNotifications,
  scheduleNotifications,
};
