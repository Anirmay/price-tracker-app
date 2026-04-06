const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    alertType: {
      type: String,
      enum: ['price_drop', 'percentage_drop', 'back_in_stock', 'price_target'],
      required: true,
    },
    targetPrice: {
      type: Number,
      default: null,
    },
    percentageDrop: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    triggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
priceAlertSchema.index({ userId: 1, productId: 1 });
priceAlertSchema.index({ isActive: 1, triggered: 0 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
