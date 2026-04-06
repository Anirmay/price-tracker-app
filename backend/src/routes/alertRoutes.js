const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
} = require('../controllers/alertController');

const router = express.Router();

// Create alert
router.post(
  '/',
  auth,
  [
    body('productId', 'Product ID is required').notEmpty(),
    body('alertType', 'Alert type is required').isIn([
      'price_drop',
      'percentage_drop',
      'back_in_stock',
      'price_target',
    ]),
  ],
  handleValidationErrors,
  createAlert
);

// Get all alerts
router.get('/', auth, getAlerts);

// Update alert
router.put('/:id', auth, updateAlert);

// Delete alert
router.delete('/:id', auth, deleteAlert);

module.exports = router;
