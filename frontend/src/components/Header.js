import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../hooks/store';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Don't render navigation until component is mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            💰 Price Tracker
          </Link>
        </div>
      </header>
    );
  }

  const isAuthenticated = !!user || !!token || !!localStorage.getItem('token');

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          💰 Price Tracker
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/alerts">Alerts</Link>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
