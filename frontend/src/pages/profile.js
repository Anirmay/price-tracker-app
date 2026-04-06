import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/Profile.module.css';
import { authService } from '../services/api';
import { useAuthStore } from '../hooks/store';

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.user;
      setFormData({
        name: userData.name,
        phone: userData.phone || '',
        notifications: userData.notifications,
      });
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const [section, key] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile(formData);
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>My Profile Settings</h1>

          {error && <div className={styles.alert}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Information */}
            <section className={styles.section}>
              <h2>📋 Basic Information</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  placeholder="Your registered email"
                />
                <p className={styles.hint}>Email cannot be changed</p>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className={styles.section}>
              <h2>🔔 Notification Preferences</h2>

              {/* Email Notifications */}
              <div className={styles.notificationCard}>
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationTitle}>
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleChange}
                      id="email-notif"
                    />
                    <label htmlFor="email-notif">📧 Email Notifications</label>
                  </div>
                  <button
                    type="button"
                    className={styles.expandBtn}
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === 'email' ? null : 'email'
                      )
                    }
                  >
                    {expandedSection === 'email' ? '−' : '+'}
                  </button>
                </div>
                {expandedSection === 'email' && (
                  <div className={styles.details}>
                    <p>
                      Get price alerts delivered to your email. Receive notifications
                      when prices drop, target prices are reached, or products are back
                      in stock.
                    </p>
                    <p className={styles.status}>
                      ✓ Configured and ready to use
                    </p>
                  </div>
                )}
              </div>

              {/* Push Notifications */}
              <div className={styles.notificationCard}>
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationTitle}>
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={formData.notifications.push}
                      onChange={handleChange}
                      id="push-notif"
                    />
                    <label htmlFor="push-notif">🔔 Browser Push Notifications</label>
                  </div>
                  <button
                    type="button"
                    className={styles.expandBtn}
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === 'push' ? null : 'push'
                      )
                    }
                  >
                    {expandedSection === 'push' ? '−' : '+'}
                  </button>
                </div>
                {expandedSection === 'push' && (
                  <div className={styles.details}>
                    <p>
                      Receive real-time browser notifications even when the app is closed.
                    </p>
                    <p className={styles.hint}>
                      Note: Your browser will ask for permission the first time
                      notifications are sent. Click "Allow" to receive notifications.
                    </p>
                    <p className={styles.status}>✓ Ready to enable</p>
                  </div>
                )}
              </div>

              {/* SMS Notifications */}
              <div className={styles.notificationCard}>
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationTitle}>
                    <input
                      type="checkbox"
                      name="notifications.sms"
                      checked={formData.notifications.sms}
                      onChange={handleChange}
                      id="sms-notif"
                    />
                    <label htmlFor="sms-notif">💬 SMS Notifications</label>
                  </div>
                  <button
                    type="button"
                    className={styles.expandBtn}
                    onClick={() =>
                      setExpandedSection(expandedSection === 'sms' ? null : 'sms')
                    }
                  >
                    {expandedSection === 'sms' ? '−' : '+'}
                  </button>
                </div>
                {expandedSection === 'sms' && (
                  <div className={styles.details}>
                    <p>
                      Get alerts as SMS text messages to your phone number.
                    </p>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        disabled={!formData.notifications.sms}
                      />
                      <p className={styles.hint}>
                        Include country code (e.g., +91 for India)
                      </p>
                    </div>
                    <details className={styles.setup}>
                      <summary>ℹ️ How to enable SMS?</summary>
                      <div className={styles.setupContent}>
                        <ol>
                          <li>Admin needs to set up Twilio account</li>
                          <li>Add SMS credentials to backend .env file</li>
                          <li>You enter your phone number above</li>
                          <li>Enable SMS notifications via this checkbox</li>
                          <li>Start receiving SMS alerts!</li>
                        </ol>
                        <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer">
                          Learn more about Twilio →
                        </a>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </section>

            {/* Alert Summary */}
            <section className={styles.section}>
              <h2>📊 Notification Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryIcon}>📧</span>
                  <p className={styles.summaryLabel}>Email</p>
                  <p className={formData.notifications.email ? styles.active : styles.inactive}>
                    {formData.notifications.email ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryIcon}>🔔</span>
                  <p className={styles.summaryLabel}>Push</p>
                  <p className={formData.notifications.push ? styles.active : styles.inactive}>
                    {formData.notifications.push ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className={styles.summaryCard}>
                  <span className={styles.summaryIcon}>💬</span>
                  <p className={styles.summaryLabel}>SMS</p>
                  <p className={formData.notifications.sms ? styles.active : styles.inactive}>
                    {formData.notifications.sms ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </section>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
