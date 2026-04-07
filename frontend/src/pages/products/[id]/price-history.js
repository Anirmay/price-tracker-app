import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../../components/Header';
import styles from '../../../styles/PriceHistory.module.css';
import { productService } from '../../../services/api';
import { formatPrice } from '../../../utils/formatPrice';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PriceHistory() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data.product);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Product not found'}</div>
          <Link href="/dashboard" className={styles.backBtn}>
            ← Back to Dashboard
          </Link>
        </div>
      </>
    );
  }

  // Format chart data
  const chartData = (product.priceHistory || [])
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      price: entry.price,
      timestamp: new Date(entry.date),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const prices = chartData.map(d => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const currentPrice = product.currentPrice;
  const priceDropped = (maxPrice - currentPrice).toFixed(0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.date}>{payload[0].payload.date}</p>
          <p className={styles.price}>₹{formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backBtn}>
            ← Back to Dashboard
          </Link>
          <h1>Price History</h1>
        </div>

        <div className={styles.productInfo}>
          {product.image && <img src={product.image} alt={product.name} />}
          <div>
            <h2>{product.name}</h2>
            <p className={styles.platform}>{product.platform}</p>
          </div>
        </div>

        {chartData.length > 0 ? (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <label>Highest Price</label>
                <p>₹{formatPrice(maxPrice)}</p>
              </div>
              <div className={styles.stat}>
                <label>Lowest Price</label>
                <p>₹{formatPrice(minPrice)}</p>
              </div>
              <div className={styles.stat}>
                <label>Current Price</label>
                <p>₹{formatPrice(currentPrice)}</p>
              </div>
              <div className={styles.stat}>
                <label>Total Drop</label>
                <p className={styles.positive}>₹{formatPrice(priceDropped)}</p>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <h3>Price Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#5b6ef5"
                    dot={{ fill: '#5b6ef5', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Price"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className={styles.info}>
                Showing {chartData.length} price records over time
              </p>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <p>No price history available yet.</p>
            <p>Prices will be recorded as they are checked.</p>
          </div>
        )}
      </div>
    </>
  );
}
