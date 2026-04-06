import '../styles/globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '../hooks/store';
import { authService } from '../services/api';

function MyApp({ Component, pageProps }) {
  const { setUser, setToken, user } = useAuthStore();

  // Restore auth state from localStorage and verify token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Set token in store
      setToken(token);

      // Fetch user profile to validate token and get user data
      authService
        .getProfile()
        .then((response) => {
          setUser(response.data.user || response.data);
        })
        .catch((error) => {
          // Token is invalid, clear it
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
