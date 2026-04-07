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
import styles from './PriceChart.module.css';
import { formatPrice } from '../utils/formatPrice';

export default function PriceChart({ product, onClose }) {
  // Format price history data for chart
  const chartData = (product.priceHistory || []).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    price: entry.price,
    timestamp: new Date(entry.date),
  }));

  // Sort by date (oldest first)
  chartData.sort((a, b) => a.timestamp - b.timestamp);

  // Find min and max prices
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
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
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div>
            <h2>Price History</h2>
            <p className={styles.productName}>{product.name}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
            </div>

            <div className={styles.footer}>
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
    </div>
  );
}
