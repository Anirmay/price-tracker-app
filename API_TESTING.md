# API Testing Guide

## Testing with cURL

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from response:
```bash
TOKEN="your_jwt_token_here"
```

### 3. Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Add Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.amazon.in/dp/B08EXAMPLE"
  }'
```

Save the product ID from response:
```bash
PRODUCT_ID="your_product_id_here"
```

### 5. Get All Products
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Create Alert
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "alertType": "price_target",
    "targetPrice": 1800
  }'
```

### 7. Get All Alerts
```bash
curl -X GET http://localhost:5000/api/alerts \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Postman

1. **Create Collection**: Price Tracker API
2. **Set Base URL Variable**: `{{base_url}} = http://localhost:5000/api`
3. **Set Token Variable**: After login, go to Tests tab:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

### Auth Requests
- POST /auth/register
- POST /auth/login
- GET /auth/profile (with Bearer token)
- PUT /auth/profile (with Bearer token)

### Product Requests
- POST /products (add product with URL)
- GET /products (list all products)
- GET /products/:id (get single product)
- DELETE /products/:id (delete product)

### Alert Requests
- POST /alerts (create alert)
- GET /alerts (list all alerts)
- PUT /alerts/:id (update alert)
- DELETE /alerts/:id (delete alert)

### Notification Requests
- GET /notifications (list notifications)
- PUT /notifications/:id/read (mark as read)
- DELETE /notifications/:id (delete notification)

## Testing with Jest

Run tests:
```bash
npm test
```

Create test file `src/tests/api.test.js`:

```javascript
const request = require('supertest');
const app = require('../index');

describe('API Tests', () => {
  let token;
  let productId;

  describe('Auth', () => {
    test('Register user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      token = response.body.token;
    });

    test('Login user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Products', () => {
    test('Add product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          url: 'https://www.amazon.in/dp/XXXXX'
        });

      expect(response.status).toBe(201);
      productId = response.body.product._id;
    });

    test('Get products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.products)).toBe(true);
    });
  });

  describe('Alerts', () => {
    test('Create alert', async () => {
      const response = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId,
          alertType: 'price_target',
          targetPrice: 1800
        });

      expect(response.status).toBe(201);
    });
  });
});
```

## Load Testing with Apache Bench

Test endpoint performance:
```bash
# Single request
ab -n 1 -c 1 http://localhost:5000/health

# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/health

# With authentication
ab -H "Authorization: Bearer $TOKEN" \
   -n 100 -c 10 \
   http://localhost:5000/api/products
```

## Load Testing with k6

Create `loadtest.js`:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function() {
  let response = http.get('http://localhost:5000/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

Run:
```bash
k6 run loadtest.js
```

## Frontend Testing

### Manual Testing Checklist

- [ ] Register with valid email
- [ ] Login with correct credentials
- [ ] Fail login with wrong password
- [ ] Add valid Amazon/Flipkart URL
- [ ] View all tracked products
- [ ] Set price drop alert
- [ ] Set percentage drop alert
- [ ] Set target price alert
- [ ] Receive notifications (if configured)
- [ ] Delete product
- [ ] Update profile
- [ ] Toggle notification preferences
- [ ] Logout and login again
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport

### Component Testing

Use Jest and React Testing Library:
```bash
npm test
```

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

test('ProductCard displays product info', () => {
  const product = {
    _id: '123',
    name: 'Test Product',
    currentPrice: 2000,
    originalPrice: 2500,
    image: 'test.jpg',
    platform: 'amazon',
    inStock: true,
    lastUpdated: new Date()
  };

  render(<ProductCard product={product} onDelete={() => {}} onAddAlert={() => {}} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText(/₹2000/)).toBeInTheDocument();
});
```

## Debugging

### Backend Debugging
```bash
# With Node debugger
node --inspect src/index.js

# Open in Chrome: chrome://inspect
```

### Frontend Debugging
- Use React Developer Tools browser extension
- Use Redux DevTools (if using Redux)
- Use Network tab to inspect API calls
- Use Console for JS errors

## Mock Data for Testing

Use Postman Mock Server or create mock backend:
```javascript
// Mock product
{
  "_id": "123456789",
  "name": "Test Product",
  "platform": "amazon",
  "url": "https://www.amazon.in/dp/test",
  "currentPrice": 2000,
  "originalPrice": 2500,
  "inStock": true,
  "image": "https://example.com/image.jpg",
  "priceHistory": [{price: 2500, date: "2024-01-01"}],
  "lastUpdated": "2024-01-10"
}
```

## Performance Metrics

Monitor:
- API response time (target: < 200ms)
- Database query time (target: < 100ms)
- Page load time (target: < 3s)
- Time to interactive (target: < 5s)

Use:
- Chrome DevTools Performance tab
- Lighthouse for audits
- New Relic / DataDog for production monitoring
