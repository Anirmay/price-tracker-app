# Price Tracker - E-commerce Price Monitoring Application

## Overview

A full-stack web application that allows users to track product prices from **Amazon** and **Flipkart** with real-time monitoring, intelligent alerts, and multi-channel notifications.

## Features

### Core Features
- **Link-Based Product Tracking**: Paste Amazon or Flipkart product URLs to start tracking
- **Real-Time Price Monitoring**: 24×7 automatic price checking every 6 hours
- **Multiple Alert Types**:
  - Price Drop Alert
  - Percentage Drop Alert
  - Target Price Alert
  - Back in Stock Alert
- **Multi-Channel Notifications**:
  - Email notifications
  - Push notifications (browser/mobile)
  - SMS alerts (optional, extensible)
- **User Dashboard**: Track all products in one place with current prices and trends
- **Price History**: Visual display of price changes over time
- **User Profiles**: Customize notification preferences

### Technical Features
- Secure user authentication with JWT
- Background job scheduling for continuous monitoring
- Scalable architecture using microservices-ready patterns
- Responsive UI design
- Error handling and retry mechanisms
- Database indexing for performance

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Job Queue**: Bull (Redis-based)
- **Authentication**: JWT
- **Email**: Nodemailer
- **Push Notifications**: Web Push API
- **Web Scraping**: Cheerio, Axios, Puppeteer
- **Validation**: Express Validator

### Frontend
- **Framework**: Next.js
- **UI Library**: React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: CSS Modules
- **Date Handling**: date-fns

### Infrastructure
- **Database**: MongoDB
- **Cache/Queue**: Redis
- **Deployment**: Cloud-ready (AWS, Heroku, GCP)

## Project Structure

```
price-tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Redis configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (scraping, notifications)
│   │   ├── jobs/            # Background jobs
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Application entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/           # Next.js pages (routing)
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom hooks and state stores
│   │   └── styles/          # CSS modules
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.js
│   └── README.md
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Redis server
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in the following:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/price-tracker
   JWT_SECRET=your_secure_secret_key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Endpoints

#### Add Product
```
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://www.amazon.in/dp/XXXXX"
}
```

#### Get All Products
```
GET /api/products
Authorization: Bearer {token}
```

#### Delete Product
```
DELETE /api/products/{productId}
Authorization: Bearer {token}
```

### Alert Endpoints

#### Create Alert
```
POST /api/alerts
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id",
  "alertType": "price_target",
  "targetPrice": 1800
}
```

Alert types: `price_drop`, `percentage_drop`, `price_target`, `back_in_stock`

#### Get All Alerts
```
GET /api/alerts
Authorization: Bearer {token}
```

#### Update Alert
```
PUT /api/alerts/{alertId}
Authorization: Bearer {token}
```

#### Delete Alert
```
DELETE /api/alerts/{alertId}
Authorization: Bearer {token}
```

### Notification Endpoints

#### Get Notifications
```
GET /api/notifications
Authorization: Bearer {token}
```

#### Mark as Read
```
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}
```

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  notifications: {
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  pushSubscriptions: Array,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  userId: ObjectId (ref: User),
  url: String,
  productId: String,
  platform: String (amazon|flipkart),
  name: String,
  image: String,
  currentPrice: Number,
  originalPrice: Number,
  priceHistory: [{price, date}],
  rating: Number,
  inStock: Boolean,
  lastUpdated: Date,
  createdAt: Date
}
```

### PriceAlert
```javascript
{
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  alertType: String,
  targetPrice: Number,
  percentageDrop: Number,
  isActive: Boolean,
  triggered: Boolean,
  triggeredAt: Date,
  createdAt: Date
}
```

### Notification
```javascript
{
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  alertId: ObjectId (ref: PriceAlert),
  type: String (email|push|sms),
  status: String (pending|sent|failed),
  title: String,
  message: String,
  data: Object,
  sentAt: Date,
  retryCount: Number,
  error: String,
  createdAt: Date
}
```

## Background Jobs

### Price Check Job
- **Frequency**: Every 6 hours
- **Function**: Checks all product prices and triggers alerts when conditions are met
- **Location**: `src/jobs/priceCheckJob.js`

### Notification Job
- **Frequency**: Every 5 minutes
- **Function**: Processes pending notifications and sends them via email/push
- **Location**: `src/jobs/notificationJob.js`

## Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Configuration

### Email Configuration (Gmail)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Set `EMAIL_PASSWORD` to the App Password in `.env`

### Web Push Configuration
1. Generate VAPID keys:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Add to `.env`:
   ```
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```

### Redis Setup
**Local Development**:
```bash
# macOS
brew install redis
brew services start redis

# Windows
# Use WSL or Docker
docker run -d -p 6379:6379 redis
```

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for product listings
- Caching of product data
- Efficient scraping with timeouts
- Job queue for background processing
- Error retry mechanisms with exponential backoff

## Security

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Helmet.js for secure headers
- Input validation with express-validator
- Secure environment variable management
- Rate limiting (extensible)

## Future Enhancements

- [ ] WhatsApp integration
- [ ] Telegram notifications
- [ ] Price prediction using ML
- [ ] Browser extension
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Wishlist sharing

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check credentials in `MONGODB_URI`
- Verify network access if using MongoDB Atlas

### Redis Connection Error
- Ensure Redis server is running
- Check `REDIS_HOST` and `REDIS_PORT`

### Email Not Sending
- Enable "Less secure apps" for Gmail or use App Password
- Check SMTP settings in `.env`
- Verify recipient email is valid

### Scraping Not Working
- Websites may have changed structure - update selectors
- Use Puppeteer for JavaScript-heavy sites
- Implement proxy rotation for rate limiting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue on GitHub or contact the development team.

## Authors

- Your Name / Development Team
