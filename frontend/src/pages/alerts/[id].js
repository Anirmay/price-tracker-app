import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/AlertDetail.module.css';
import { alertService } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

export default function AlertDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (id) {
      loadAlert();
    }
  }, [id]);

  const loadAlert = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAlerts();
      const foundAlert = response.data.alerts?.find((a) => a._id === id);
      if (foundAlert) {
        setAlert(foundAlert);
      } else {
        setError('Alert not found');
      }
    } catch (err) {
      setError('Failed to load alert details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async () => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;

    try {
      await alertService.deleteAlert(id);
      router.push('/alerts');
    } catch (err) {
      setError('Failed to delete alert');
    }
  };

  const toggleAlert = async (newStatus) => {
    try {
      await alertService.updateAlert(id, { isActive: newStatus });
      setAlert({ ...alert, isActive: newStatus });
    } catch (err) {
      setError('Failed to update alert');
    }
  };

  const getAlertTypeLabel = (type) => {
    const labels = {
      price_drop: 'Price Drop Alert',
      percentage_drop: 'Percentage Drop Alert',
      price_target: 'Target Price Alert',
      back_in_stock: 'Back in Stock Alert',
    };
    return labels[type] || type;
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      price_drop: '#4CAF50',
      percentage_drop: '#2196F3',
      price_target: '#FF9800',
      back_in_stock: '#9C27B0',
    };
    return colors[type] || '#666';
  };

  if (loading) return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.loading}>Loading alert details...</div>
      </div>
    </>
  );

  if (error || !alert) return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Link href="/alerts" className={styles.backBtn}>
          ← Back to Alerts
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Link href="/alerts" className={styles.backBtn}>
          ← Back to Alerts
        </Link>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1>Alert Details</h1>
            <span
              className={styles.badge}
              style={{ backgroundColor: getAlertTypeColor(alert.alertType) }}
            >
              {getAlertTypeLabel(alert.alertType)}
            </span>
          </div>

          <div className={styles.alertStatus}>
            <div className={styles.statusItem}>
              <label>Status</label>
              <p>{alert.isActive ? '✓ Active' : '× Inactive'}</p>
            </div>
            <div className={styles.statusItem}>
              <label>Created</label>
              <p>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</p>
            </div>
            {alert.triggered && (
              <div className={styles.statusItem}>
                <label>Triggered</label>
                <p>✓ Yes ({formatDistanceToNow(new Date(alert.triggeredAt), { addSuffix: true })})</p>
              </div>
            )}
          </div>

          {alert.productId && (
            <div className={styles.productSection}>
              <h2>Product Details</h2>
              <div className={styles.product}>
                {alert.productId.image && (
                  <div className={styles.productImage}>
                    <img src={alert.productId.image} alt={alert.productId.name} />
                  </div>
                )}

                <div className={styles.productDetails}>
                  <h3>{alert.productId.name}</h3>

                  <div className={styles.priceInfo}>
                    <div className={styles.priceItem}>
                      <label>Current Price</label>
                      <p className={styles.price}>₹{alert.productId.currentPrice}</p>
                    </div>
                    {alert.productId.originalPrice && (
                      <div className={styles.priceItem}>
                        <label>Original Price</label>
                        <p className={styles.originalPrice}>₹{alert.productId.originalPrice}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.metadata}>
                    <div>
                      <label>Platform</label>
                      <p>{alert.productId.platform}</p>
                    </div>
                    <div>
                      <label>Stock Status</label>
                      <p className={alert.productId.inStock ? styles.inStock : styles.outOfStock}>
                        {alert.productId.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.alertConfig}>
            <h2>Alert Configuration</h2>
            <div className={styles.configItems}>
              <div className={styles.configItem}>
                <label>Alert Type</label>
                <p>{getAlertTypeLabel(alert.alertType)}</p>
              </div>

              {alert.alertType === 'price_target' && alert.targetPrice && (
                <div className={styles.configItem}>
                  <label>Target Price</label>
                  <p>₹{alert.targetPrice}</p>
                </div>
              )}

              {alert.alertType === 'percentage_drop' && alert.percentageDrop && (
                <div className={styles.configItem}>
                  <label>Drop Percentage</label>
                  <p>{alert.percentageDrop}%</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <a
              href={alert.productId?.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyBtn}
            >
              🛒 Buy Product on {alert.productId?.platform}
            </a>

            <button
              onClick={() => toggleAlert(!alert.isActive)}
              className={alert.isActive ? styles.deactivateBtn : styles.activateBtn}
            >
              {alert.isActive ? 'Deactivate Alert' : 'Activate Alert'}
            </button>

            <button onClick={handleDeleteAlert} className={styles.deleteBtn}>
              🗑️ Delete Alert & Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
