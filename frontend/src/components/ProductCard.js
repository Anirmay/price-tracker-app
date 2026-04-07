import styles from './ProductCard.module.css';
import { formatDistanceToNow } from 'date-fns';
import { formatPrice } from '../utils/formatPrice';
import { useState } from 'react';
import PriceChart from './PriceChart';

export default function ProductCard({ product, onDelete, onAddAlert }) {
  const [showChart, setShowChart] = useState(false);
  const priceChange = product.originalPrice - product.currentPrice;
  const percentageChange = (
    ((priceChange) / product.originalPrice) *
    100
  ).toFixed(1);

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={product.image} alt={product.name} />
        <span className={styles.platform}>{product.platform}</span>
      </div>

      <div className={styles.content}>
        <h3>{product.name}</h3>

        <div className={styles.prices}>
          <div className={styles.currentPrice}>
            <span>Current Price</span>
            <p className={styles.priceValue}>₹{formatPrice(product.currentPrice)}</p>
          </div>

          {priceChange > 0 && (
            <div className={styles.savings}>
              <span>savings</span>
              <p className={styles.positive}>
                ₹{formatPrice(priceChange)} ({percentageChange}% off)
              </p>
            </div>
          )}
        </div>

        <div className={styles.status}>
          {product.inStock ? (
            <span className={styles.inStock}>In Stock</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
          <span className={styles.updated}>
            Updated {formatDistanceToNow(new Date(product.lastUpdated), { addSuffix: true })}
          </span>
        </div>

        <div className={styles.actions}>
          <button onClick={() => setShowChart(true)} className={styles.chartBtn}>
            📊 Price History
          </button>
          <button onClick={() => onAddAlert(product)} className={styles.alertBtn}>
            Set Alert
          </button>
          <button onClick={() => onDelete(product._id)} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </div>

      {showChart && <PriceChart product={product} onClose={() => setShowChart(false)} />}
    </div>
  );
}
