import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import AlertModal from '../components/AlertModal';
import styles from '../styles/Dashboard.module.css';
import { productService, alertService } from '../services/api';
import { useProductStore, useAlertStore } from '../hooks/store';

export default function Dashboard() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, setProducts, addProduct, removeProduct } = useProductStore();
  const { addAlert } = useAlertStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await productService.addProduct({ url });
      addProduct(response.data.product);
      setUrl('');
      setSuccess('Product added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await productService.deleteProduct(productId);
      removeProduct(productId);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAddAlert = async (alertData) => {
    try {
      const response = await alertService.createAlert(alertData);
      addAlert(response.data.alert);
      setSelectedProduct(null);
      setSuccess('Alert created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <section className={styles.inputSection}>
          <h1>Add Product to Track</h1>
          <form onSubmit={handleAddProduct} className={styles.inputForm}>
            <input
              type="url"
              placeholder="Paste Flipkart or Amazon product URL... (e.g., https://www.amazon.in/dp/XXXXX)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {error && <div className={styles.alert}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </section>

        <section className={styles.productsSection}>
          <h2>Tracked Products ({products.length})</h2>

          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products being tracked yet.</p>
              <p>Start by adding a product from Amazon or Flipkart!</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onAddAlert={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <AlertModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={handleAddAlert}
        />
      )}
    </>
  );
}
