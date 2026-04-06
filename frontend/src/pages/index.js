import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <div className={styles.container}></div>
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Welcome Back! 👋</h1>
              <p>Start tracking product prices and never miss a great deal.</p>

              <div className={styles.ctaButtons}>
                <Link href="/dashboard" className={styles.primaryBtn}>
                  Go to Dashboard
                </Link>
                <Link href="/alerts" className={styles.secondaryBtn}>
                  View Alerts
                </Link>
              </div>
            </div>

            <div className={styles.heroImage}>
              <div className={styles.imagePlaceholder}>💰</div>
            </div>
          </section>

          <section className={styles.features}>
            <h2>Your Tracking Benefits</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.icon}>🔗</div>
                <h3>Easy Link Sharing</h3>
                <p>Simply paste Amazon or Flipkart product links to start tracking</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.icon}>📊</div>
                <h3>Real-Time Tracking</h3>
                <p>Get 24x7 price monitoring with continuous updates</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.icon}>🔔</div>
                <h3>Smart Alerts</h3>
                <p>Set custom price drop, percentage, or target price alerts</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.icon}>📧</div>
                <h3>Multi-Channel Notifications</h3>
                <p>Get alerts via email, push notifications, or SMS</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.icon}>📈</div>
                <h3>Price History</h3>
                <p>View detailed price trends over time</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.icon}>⚙️</div>
                <h3>Manage Alerts</h3>
                <p>Easily edit or delete alerts as needed</p>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Track Product Prices Effortlessly</h1>
            <p>
              Monitor prices from Amazon and Flipkart, get instant alerts when
              prices drop, and never miss a great deal again.
            </p>

            <div className={styles.ctaButtons}>
              <Link href="/register" className={styles.primaryBtn}>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondaryBtn}>
                Login
              </Link>
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.imagePlaceholder}>💰</div>
          </div>
        </section>

        <section className={styles.features}>
          <h2>Key Features</h2>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.icon}>🔗</div>
              <h3>Easy Link Sharing</h3>
              <p>
                Simply paste Amazon or Flipkart product links to start tracking
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.icon}>📊</div>
              <h3>Real-Time Tracking</h3>
              <p>Get 24x7 price monitoring with continuous updates</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.icon}>🔔</div>
              <h3>Smart Alerts</h3>
              <p>
                Set custom price drop, percentage, or target price alerts
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.icon}>📧</div>
              <h3>Multi-Channel Notifications</h3>
              <p>Get alerts via email, push notifications, or SMS</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.icon}>📈</div>
              <h3>Price History</h3>
              <p>View detailed price trends over time</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.icon}>⚙️</div>
              <h3>Manage Alerts</h3>
              <p>Easily edit or delete alerts as needed</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Start Saving Money Today</h2>
          <p>Join thousands of users tracking prices on Amazon and Flipkart</p>
          <Link href="/register" className={styles.ctaButton}>
            Create Your Free Account
          </Link>
        </section>
      </div>
    </>
  );
}
