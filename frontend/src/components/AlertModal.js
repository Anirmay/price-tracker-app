import styles from './AlertModal.module.css';
import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';

export default function AlertModal({ product, onClose, onSubmit }) {
  const [alertType, setAlertType] = useState('price_drop');
  const [targetPrice, setTargetPrice] = useState(product.currentPrice * 0.9);
  const [percentageDrop, setPercentageDrop] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      productId: product._id,
      alertType,
      targetPrice: alertType === 'price_target' ? targetPrice : undefined,
      percentageDrop:
        alertType === 'percentage_drop' ? percentageDrop : undefined,
    });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Set Price Alert</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.productInfo}>
          <img src={product.image} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>Current Price: ₹{formatPrice(product.currentPrice)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="alertType">Alert Type</label>
            <select
              id="alertType"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="price_drop">Price Drop</option>
              <option value="percentage_drop">Percentage Drop</option>
              <option value="price_target">Target Price</option>
              <option value="back_in_stock">Back in Stock</option>
            </select>
          </div>

          {alertType === 'price_target' && (
            <div className={styles.formGroup}>
              <label htmlFor="targetPrice">Target Price (₹)</label>
              <input
                type="number"
                id="targetPrice"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                step="10"
              />
            </div>
          )}

          {alertType === 'percentage_drop' && (
            <div className={styles.formGroup}>
              <label htmlFor="percentageDrop">Percentage Drop (%)</label>
              <input
                type="number"
                id="percentageDrop"
                value={percentageDrop}
                onChange={(e) => setPercentageDrop(parseFloat(e.target.value))}
                min="1"
                max="100"
                step="1"
              />
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
