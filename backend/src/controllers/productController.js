const Product = require('../models/Product');
const PriceAlert = require('../models/PriceAlert');
const { fetchProductDetails } = require('../services/scraperService');

const addProduct = async (req, res) => {
  try {
    const { url } = req.body;

    // Fetch product details
    const productData = await fetchProductDetails(url);

    // Check if product already tracked
    const existingProduct = await Product.findOne({
      userId: req.userId,
      productId: productData.productId,
      platform: productData.platform,
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already being tracked' });
    }

    // Create new product
    const product = new Product({
      userId: req.userId,
      url,
      productId: productData.productId,
      platform: productData.platform,
      name: productData.name,
      image: productData.image,
      currentPrice: productData.price,
      originalPrice: productData.price,
      inStock: productData.inStock,
      priceHistory: [
        {
          price: productData.price,
          date: new Date(),
        },
      ],
    });

    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated alerts
    await PriceAlert.deleteMany({ productId: product._id });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProductPrice = async (productId, newPrice) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        currentPrice: newPrice,
        lastUpdated: new Date(),
        $push: {
          priceHistory: {
            price: newPrice,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    return product;
  } catch (error) {
    console.error('Error updating product price:', error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProductPrice,
};
