const express = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} = require('../controllers/notificationController');

const router = express.Router();

// Get notifications
router.get('/', auth, getNotifications);

// Mark as read
router.put('/:id/read', auth, markAsRead);

// Delete notification
router.delete('/:id', auth, deleteNotification);

// Subscribe to push notifications
router.post('/push/subscribe', auth, subscribeToPushNotifications);

// Unsubscribe from push notifications
router.post('/push/unsubscribe', auth, unsubscribeFromPushNotifications);

module.exports = router;
