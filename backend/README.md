# Backend - Price Tracker API

## Overview

Express.js REST API for the Price Tracker application. Handles user authentication, product management, price tracking, and notifications.

## Features

- User registration and authentication (JWT)
- Product CRUD operations
- Price alert management
- Real-time price monitoring with background jobs
- Multi-channel notification system
- Web scraping for price extraction

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/price-tracker
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRY=7d
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@pricetracker.com

FRONTEND_URL=http://localhost:3000

VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key

PROXY_URL=
USE_PUPPETEER=false
SCRAPE_TIMEOUT=10000
```

## Running

**Development**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will start on port 5000 (or specified PORT in .env)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `POST /api/products` - Add product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `DELETE /api/products/:id` - Delete product

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## Architecture

### Controllers
Handle HTTP request/response logic

### Services
Business logic for scraping, notifications, and utilities

### Models
MongoDB schema definitions

### Middleware
Authentication and validation

### Jobs
Background task processing

## Key Services

### Scraper Service
- Parses Amazon and Flipkart URLs
- Fetches product details using web scraping
- Extractes: name, price, image, stock status

### Email Service
- Sends email notifications using Nodemailer
- Supports HTML templates

### Push Notification Service
- Sends browser push notifications
- Uses Web Push API with VAPID keys

### Job Queue
- Bull for Redis-based job processing
- Price check jobs every 6 hours
- Notification jobs every 5 minutes

## Database Indexes

Created for fast queries:
- `User.email` (unique)
- `Product.userId`
- `Product.lastUpdated`
- `Product.userId_productId_platform` (unique)
- `PriceAlert.userId_productId`
- `PriceAlert.isActive_triggered`
- `Notification.userId_status`

## Error Handling

- Validation errors return 400
- Authentication errors return 401
- Not found errors return 404
- Server errors return 500
- Error messages in response body

## Security

- Passwords hashed with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS enabled
- Helmet.js security headers
- Environment variables for sensitive data

## Performance

- Database connection pooling
- Efficient queries with indexes
- Job queue for non-blocking operations
- Timeout configurations
- Retry mechanisms for failed jobs

## Monitoring

- Morgan logging for HTTP requests
- Console logs for background jobs
- Error logging with stack traces

## Testing

```bash
npm run test
```

## Deployment

See main README.md for deployment instructions

## Troubleshooting

### Database errors
- Check MongoDB connection string
- Ensure MongoDB is running
- Verify network connectivity

### Redis errors
- Start Redis server
- Check Redis host/port configuration

### Email errors
- Verify Gmail credentials
- Use App Password for Gmail with 2FA
- Check internet connection

### Scraping errors
- Website structure may have changed
- Add appropriate User-Agent headers
- Implement retry logic

## Future Updates

- [ ] Rate limiting
- [ ] API versioning
- [ ] Advanced error logging
- [ ] Analytics endpoints
- [ ] Admin endpoints
- [ ] SMS integration
- [ ] Webhook support
