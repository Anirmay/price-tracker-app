import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';
import styles from '../styles/Alerts.module.css';
import { alertService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

export default function Alerts() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAlerts();
      setAlerts(response.data.alerts || []);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Delete this alert?')) return;

    try {
      await alertService.deleteAlert(alertId);
      setAlerts(alerts.filter((a) => a._id !== alertId));
    } catch (err) {
      setError('Failed to delete alert');
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

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Price Alerts</h1>
          <Link href="/dashboard" className={styles.backBtn}>
            ← Back to Dashboard
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className={styles.empty}>
            <p>No alerts created yet.</p>
            <Link href="/dashboard" className={styles.cta}>
              Create an Alert
            </Link>
          </div>
        ) : (
          <div className={styles.alerts}>
            {alerts.map((alert) => (
              <div key={alert._id} className={styles.alertCard}>
                <div className={styles.alertHeader}>
                  <div className={styles.alertType}>
                    <span
                      className={styles.badge}
                      style={{ backgroundColor: getAlertTypeColor(alert.alertType) }}
                    >
                      {getAlertTypeLabel(alert.alertType)}
                    </span>
                    {alert.isActive ? (
                      <span className={styles.active}>Active</span>
                    ) : (
                      <span className={styles.inactive}>Inactive</span>
                    )}
                    {alert.triggered && <span className={styles.triggered}>Triggered!</span>}
                  </div>
                </div>

                {alert.productId && (
                  <div className={styles.productInfo}>
                    {alert.productId.image && (
                      <img src={alert.productId.image} alt={alert.productId.name} />
                    )}
                    <div className={styles.details}>
                      <h3>{alert.productId.name}</h3>
                      <p className={styles.price}>₹{alert.productId.currentPrice}</p>
                      <p className={styles.platform}>{alert.productId.platform}</p>
                      <div className={styles.alertDetails}>
                        {alert.alertType === 'price_target' && alert.targetPrice && (
                          <p>Target Price: ₹{alert.targetPrice}</p>
                        )}
                        {alert.alertType === 'percentage_drop' && alert.percentageDrop && (
                          <p>Alert at {alert.percentageDrop}% drop</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.footer}>
                  <Link href={`/alerts/${alert._id}`} className={styles.viewBtn}>
                    View Details
                  </Link>
                  <a
                    href={alert.productId?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyBtn}
                  >
                    Buy Now
                  </a>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
