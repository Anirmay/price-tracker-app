const webpush = require('web-push');
const Notification = require('../models/Notification');

// Set VAPID details only if keys are properly configured
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PUBLIC_KEY.startsWith('dev_') === false) {
  webpush.setVapidDetails(
    'mailto:' + process.env.EMAIL_USER,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const sendPushNotification = async (subscription, title, message, data) => {
  try {
    // Skip if VAPID not configured (development mode)
    if (!process.env.VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY.startsWith('dev_')) {
      console.log('Push notifications disabled (VAPID not configured)');
      return true;
    }

    const notificationPayload = {
      notification: {
        title,
        body: message,
        icon: '/logo.png',
        badge: '/badge.png',
      },
      data: data || {},
    };

    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    if (error.statusCode === 410) {
      console.log('Subscription no longer valid');
    }
    throw error;
  }
};

const sendBrowserNotification = async (userId, title, message, data) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (user && user.pushSubscriptions && user.pushSubscriptions.length > 0) {
      const promises = user.pushSubscriptions.map((subscription) =>
        sendPushNotification(subscription, title, message, data).catch((error) => {
          console.error('Failed to send push notification:', error);
        })
      );

      await Promise.all(promises);
    }

    return true;
  } catch (error) {
    console.error('Error sending browser notifications:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  sendBrowserNotification,
};
