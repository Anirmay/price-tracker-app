# Price Tracker - Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React/Next.js Frontend (http://localhost:3000)      │   │
│  │  - User Authentication                               │   │
│  │  - Dashboard with Product List                       │   │
│  │  - Alert Management                                  │   │
│  │  - Notification Center                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                    │
│              (http://localhost:5000/api)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST API                                            │   │
│  │  - Auth Routes (register, login, profile)            │   │
│  │  - Product Routes (CRUD)                             │   │
│  │  - Alert Routes (CRUD)                               │   │
│  │  - Notification Routes                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers & Services                              │   │
│  │  - Scraper Service (web scraping)                    │   │
│  │  - Email Service (nodemailer)                        │   │
│  │  - Push Notification Service                         │   │
│  │  - Auth Service (JWT)                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   DATA & CACHE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  MongoDB     │  │    Redis     │  │   Bull Queue │       │
│  │              │  │              │  │              │       │
│  │ - Users      │  │ - Cache      │  │ - Job Queue  │       │
│  │ - Products   │  │ - Sessions   │  │ - PriceCheck │       │
│  │ - Alerts     │  │              │  │ - Notif Jobs │       │
│  │ - Notifs     │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   BACKGROUND JOBS                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Price Check Job (every 6 hours)                     │   │
│  │  - Fetch current prices                              │   │
│  │  - Check alert conditions                            │   │
│  │  - Trigger alerts                                    │   │
│  │                                                      │   │
│  │  Notification Job (every 5 minutes)                  │   │
│  │  - Process pending notifications                     │   │
│  │  - Send emails/push notifications                    │   │
│  │  - Update notification status                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Amazon    │  │ Flipkart   │  │   Gmail    │            │
│  │ Website    │  │ Website    │  │  SMTP      │            │
│  │            │  │            │  │            │            │
│  │ Web        │  │ Web        │  │ Email      │            │
│  │ Scraping   │  │ Scraping   │  │ Notif      │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration
```
Frontend Register → Backend API → Bcrypt Hash → MongoDB Save → JWT Token
```

### 2. Add Product
```
Frontend URL → Backend → Web Scraper → Extract Details → MongoDB Save → Response
```

### 3. Price Monitoring (Background)
```
Every 6 Hours: 
  Fetch All Products → Scrape Current Prices → Compare with DB → 
  Check Alerts → Trigger Conditions → Create Notifications → Queue
```

### 4. Send Notifications (Background)
```
Every 5 Minutes:
  Get Pending Notifications → Check User Preferences → 
  Send Email → Send Push → Update Status
```

## Technology Stack Details

### Frontend Layer
- **Next.js**: SSR, routing, optimization
- **React**: UI components
- **Zustand**: State management (lightweight)
- **Axios**: HTTP client with interceptors
- **CSS Modules**: Component-scoped styling

### API Layer
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: API authentication
- **express-validator**: Input validation

### Services Layer
- **Cheerio**: HTML parsing for scraping
- **Puppeteer**: Browser automation (optional)
- **Nodemailer**: Email sending
- **web-push**: Browser notifications

### Data Layer
- **MongoDB**: Primary database
  - Documents: User, Product, Alert, Notification
  - Indexes for fast queries
  - TTL indexes for old data cleanup

- **Redis**: Caching & job queue
  - Session storage
  - Cache layer
  - Bull job queue

### Background Jobs
- **Bull**: Job queue library
- **node-cron**: Scheduled tasks
- **Redis**: Job storage

## Database Schema Relationships

```
User (1) ──── (Many) Product
              │
              └── (Many) PriceAlert
                         │
                         └── (Many) Notification

User (1) ────── (Many) Notification

Product (1) ──── (Many) PriceHistory (embedded)
```

## API Request Flow

```
Request
  ↓
Express Middleware (CORS, Morgan)
  ↓
Route Handler
  ↓
Auth Middleware (verify JWT)
  ↓
Validation Middleware
  ↓
Controller
  ↓
Service (business logic)
  ↓
Model (database)
  ↓
Response
```

## Security Layers

1. **Input Validation**: express-validator
2. **Authentication**: JWT tokens
3. **Password Security**: bcryptjs hashing
4. **CORS**: Cross-origin protection
5. **Helmet**: Security headers
6. **Rate Limiting**: (extensible)
7. **Environment Variables**: Sensitive data

## Scalability Architecture

### Horizontal Scaling Options

```
Load Balancer
    ↓
  ┌─┼─┐
  v v v
[Backend 1]
[Backend 2]  → MongoDB (Replica Set)
[Backend 3] → Redis Cluster
              → Bull Workers
```

### Vertical Elements
- Database replication
- Redis cluster mode
- Multiple Bull workers
- Container orchestration (K8s ready)

## Performance Optimizations

1. **Database**: Indexes on frequent queries
2. **Caching**: Redis for frequently accessed data
3. **Pagination**: Limit data per request
4. **Async/Await**: Non-blocking operations
5. **Connection Pooling**: MongoDB connection reuse
6. **Job Queuing**: Offload heavy tasks
7. **CDN**: Static assets delivery (frontend)

## Monitoring & Logging

```
Application Layer:
  ├── Morgan HTTP logging
  ├── Winston/Bunyan (extensible)
  └── Error tracking

Database Layer:
  ├── Query logging
  ├── Connection monitoring
  └── Index usage analysis

Job Layer:
  ├── Job status tracking
  ├── Failure alerts
  └── Performance metrics
```

## Error Handling Strategy

```
Frontend Error
  ↓
API Error Response
  ↓
Error Middleware Catches
  ↓
Log to File/Service
  ↓
Return Formatted Error
  ↓
Frontend Displays User-Friendly Message
```

## Authentication Flow

```
1. User Registers
   └→ Hash password → Save to DB → Return token

2. User Logs In
   └→ Find user → Compare password → Generate JWT → Return token

3. Protected Route
   └→ Extract token from header → Verify JWT → Attach userId → Continue

4. Token Refresh (future enhancement)
   └→ Old token expires → User re-login required
```

## Future Architecture Enhancements

1. **Microservices**: Split into separate services
2. **GraphQL**: Alternative to REST API
3. **WebSockets**: Real-time updates
4. **Message Queue**: Kafka/RabbitMQ for scaling
5. **Caching Layer**: Redis for frequently accessed data
6. **Search Engine**: Elasticsearch for product search
7. **Analytics**: DataDog/New Relic monitoring
8. **CDN**: CloudFront/CloudFlare for global distribution

## Deployment Architecture

```
Development: All components on localhost
  ↓
Staging: Docker containers on staging server
  ↓
Production: 
  Frontend: Vercel/S3+CloudFront
  Backend: Heroku/EC2/Cloud Run
  Database: MongoDB Atlas
  Cache: Redis Cloud
  Queue: Hosted Redis
```
