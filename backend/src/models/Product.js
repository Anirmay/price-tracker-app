const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['flipkart', 'amazon'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    priceHistory: [{
      price: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    rating: {
      type: Number,
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
productSchema.index({ userId: 1, productId: 1, platform: 1 }, { unique: true });
productSchema.index({ userId: 1 });
productSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Product', productSchema);
