# Quick Start Guide

## Fastest Setup (Local Development)

### 1. Prerequisites
- Node.js v14+
- MongoDB (running locally)
- Redis (running locally)

### 2. Start MongoDB (in separate terminal)
```bash
# macOS/Linux
mongod

# Windows (if installed)
mongod

# Alternative: Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. Start Redis (in separate terminal)
```bash
# macOS/Linux
redis-server

# Windows (if installed)
redis-server

# Alternative: Docker
docker run -d -p 6379:6379 --name redis redis
```

### 4. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
✅ Backend runs on http://localhost:5000

### 5. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs on http://localhost:3000

## Docker Setup (One Command)

```bash
docker-compose up
```

Done! Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Testing the Application

### 1. Open http://localhost:3000 in browser

### 2. Register new account
- Email: test@example.com
- Password: password123

### 3. Add a product
- Go to Dashboard
- Paste Amazon URL: `https://www.amazon.in/dp/B08XXXXXXXXX`
- Or Flipkart URL: `https://www.flipkart.com/p/XXXXXXXXXXX`

### 4. Set an alert
- Click "Set Alert" on product
- Choose alert type
- Set conditions
- Click "Set Alert"

### 5. View profile
- Go to Profile
- Toggle notification preferences

## Common Issues & Solutions

### ❌ MongoDB connection failed
```bash
# Check if MongoDB is running
mongod

# Or check Docker
docker ps | grep mongodb
```

### ❌ Redis connection failed
```bash
# Check if Redis is running
redis-cli ping

# Or check Docker
docker ps | grep redis
```

### ❌ Port already in use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### ❌ npm modules not found
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/price-tracker
JWT_SECRET=test_secret_key_change_in_production
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Navigation

```
Backend:
- localhost:5000/health (check if running)
- localhost:5000/api/auth/* (authentication)
- localhost:5000/api/products/* (products)
- localhost:5000/api/alerts/* (alerts)

Frontend:
- localhost:3000/ (home)
- localhost:3000/register (sign up)
- localhost:3000/login (sign in)
- localhost:3000/dashboard (main app)
- localhost:3000/profile (settings)
```

## Useful Commands

```bash
# Backend
npm run dev              # Start development server with auto-reload
npm start               # Start production server
npm test                # Run tests

# Frontend
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# Database
mongosh                 # MongoDB CLI (if installed)
mongo                   # MongoDB shell (older versions)

# Redis
redis-cli               # Redis CLI
redis-cli monitor       # Monitor Redis commands
```

## Accessing API Directly

### Get token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check health
```bash
curl http://localhost:5000/health
```

### Get products (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/products
```

## File Structure Reference

```
/backend
  /src
    index.js           # Main app entry
    /config            # Database & Redis setup
    /controllers       # Request handlers
    /models            # Database schemas
    /routes            # API endpoints
    /services          # Business logic
    /middleware        # Auth, validation
    /jobs              # Background tasks
  .env                 # Configuration
  package.json

/frontend
  /src
    /pages             # Next.js routes
    /components        # React components
    /services          # API client
    /hooks             # State & custom hooks
    /styles            # CSS styling
  .env.local           # Configuration
  package.json
```

## Next Steps

1. **Configure Email** (optional)
   - Get Gmail App Password
   - Update EMAIL_USER and EMAIL_PASSWORD in .env

2. **Configure Push Notifications** (optional)
   - Generate VAPID keys: `npx web-push generate-vapid-keys`
   - Add to .env file

3. **Deploy to Production**
   - See DEPLOYMENT.md for detailed instructions

4. **Customize Styling**
   - Modify CSS in `/src/styles/` folders

5. **Add More Features**
   - SMS integration
   - Telegram alerts
   - Price prediction

## Support & Debugging

### Check logs
- Backend: Console output and `/logs/` directory
- Frontend: Browser DevTools Console
- Docker: `docker-compose logs service_name`

### Enable verbose logging
- Backend: Set `NODE_ENV=development`
- Frontend: Open DevTools

### Monitor jobs
- Check MongoDB for notifications collection
- Check Redis for job queue status

## Security Reminders

⚠️ **Before Production:**
- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Use strong database passwords
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Regular security updates

## Getting Help

1. Check logs first
2. Review error messages in console
3. Verify all services are running
4. Check .env configuration
5. Review README.md files
6. Check API_TESTING.md for examples

## Ready to Deploy?

See DEPLOYMENT.md for production deployment steps.
