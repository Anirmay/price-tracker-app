const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');

const createAlert = async (req, res) => {
  try {
    const { productId, alertType, targetPrice, percentageDrop } = req.body;

    // Verify product belongs to user
    const product = await Product.findOne({
      _id: productId,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create alert
    const alert = new PriceAlert({
      userId: req.userId,
      productId,
      alertType,
      targetPrice,
      percentageDrop,
    });

    await alert.save();

    res.status(201).json({
      message: 'Alert created successfully',
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({
      userId: req.userId,
    })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, targetPrice, percentageDrop } = req.body;

    const alert = await PriceAlert.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        isActive,
        targetPrice,
        percentageDrop,
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({
      message: 'Alert updated successfully',
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
};
