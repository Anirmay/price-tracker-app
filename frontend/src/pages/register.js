import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/Auth.module.css';
import { authService } from '../services/api';
import { useAuthStore } from '../hooks/store';

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting registration with:', { name: formData.name, email: formData.email });
      const response = await authService.register(formData);
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setToken(response.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error details:', {
        message: err.response?.data?.message,
        status: err.response?.status,
        data: err.response?.data,
        error: err.message
      });
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1>Create Account</h1>
          <p>Join Price Tracker to start monitoring prices</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className={styles.link}>
            Already have an account?{' '}
            <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
}
