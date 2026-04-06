const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Add product
router.post(
  '/',
  auth,
  [body('url', 'Valid URL is required').isURL()],
  handleValidationErrors,
  addProduct
);

// Get all products
router.get('/', auth, getProducts);

// Get single product
router.get('/:id', auth, getProduct);

// Delete product
router.delete('/:id', auth, deleteProduct);

module.exports = router;
