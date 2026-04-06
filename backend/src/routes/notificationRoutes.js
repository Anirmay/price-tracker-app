const express = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

// Get notifications
router.get('/', auth, getNotifications);

// Mark as read
router.put('/:id/read', auth, markAsRead);

// Delete notification
router.delete('/:id', auth, deleteNotification);

module.exports = router;
