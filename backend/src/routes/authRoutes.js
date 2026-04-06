const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  handleValidationErrors,
  register
);

// Login
router.post(
  '/login',
  [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  handleValidationErrors,
  login
);

// Get profile
router.get('/profile', auth, getProfile);

// Update profile
router.put('/profile', auth, updateProfile);

module.exports = router;
