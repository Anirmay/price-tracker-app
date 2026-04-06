# Price Tracker - Deployment Guide

## Local Development

### Prerequisites
- Node.js v14+
- MongoDB
- Redis
- npm or yarn

### Quick Start

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd price-tracker
   ```

2. **Run setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start services**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Health check: http://localhost:5000/health

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd price-tracker
   ```

2. **Set environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your credentials
   ```

3. **Build and run containers**
   ```bash
   docker-compose up -d
   ```

4. **Check logs**
   ```bash
   docker-compose logs -f
   ```

5. **Access services**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017
   - Redis: localhost:6379

6. **Stop containers**
   ```bash
   docker-compose down
   ```

## Heroku Deployment (Backend)

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB Atlas**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   ```

3. **Add Redis**
   ```bash
   heroku addons:create heroku-redis:premium-0
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set EMAIL_USER=your_email
   heroku config:set EMAIL_PASSWORD=your_app_password
   heroku config:set FRONTEND_URL=your_frontend_url
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View logs**
   ```bash
   heroku logs --tail
   ```

## Vercel Deployment (Frontend)

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from project root**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment**
   - Set `NEXT_PUBLIC_API_URL` in Vercel dashboard

4. **View deployment**
   - Dashboard: https://vercel.com/dashboard
   - Your app: Check output from `vercel` command

## AWS Deployment

### Backend (EC2)

1. **Create EC2 instance**
   - Ubuntu 20.04 LTS
   - Security group: ports 22, 5000, 80, 443

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm mongodb redis-server
   ```

4. **Clone and setup**
   ```bash
   git clone <repo-url>
   cd price-tracker/backend
   npm install
   cp .env.example .env
   # Edit .env
   ```

5. **Start services**
   ```bash
   # MongoDB
   sudo systemctl start mongodb
   
   # Redis
   sudo systemctl start redis-server
   
   # Backend with PM2
   npm install -g pm2
   pm2 start src/index.js --name "price-tracker-backend"
   pm2 save
   ```

6. **Configure Nginx reverse proxy**
   ```bash
   sudo apt install -y nginx
   # Create /etc/nginx/sites-available/price-tracker
   sudo systemctl start nginx
   ```

### Frontend (S3 + CloudFront)

1. **Build**
   ```bash
   cd frontend
   npm run build
   npm run export
   ```

2. **Create S3 bucket**
   - Upload `out` directory contents
   - Configure for website hosting
   - Block public access except for GET

3. **Create CloudFront distribution**
   - Point to S3 bucket
   - Enable caching
   - Set domain name

## GCP Deployment

### Using Cloud Run

1. **Create project**
   ```bash
   gcloud projects create price-tracker
   ```

2. **Deploy backend**
   ```bash
   cd backend
   gcloud run deploy price-tracker-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set environment variables**
   ```bash
   gcloud run services update price-tracker-backend \
     --set-env-vars MONGODB_URI=your_uri,JWT_SECRET=your_secret
   ```

4. **Deploy frontend to Cloud Storage**
   ```bash
   cd ../frontend
   npm run build
   gsutil -m cp -r out/* gs://your-bucket/
   ```

## Monitoring & Logging

### Backend Monitoring
- Use PM2 monitoring dashboard
- Set up error logging with Sentry
- Monitor Redis memory usage
- Set up MongoDB alerts

### Frontend Monitoring
- Use Vercel analytics
- Set up error tracking with Sentry
- Monitor API calls with browser DevTools

## Scaling Considerations

1. **Database**
   - Use MongoDB Atlas for managed database
   - Enable auto-backup
   - Set up replica sets for high availability

2. **Cache**
   - Use Redis for session storage
   - Implement cache invalidation
   - Monitor memory usage

3. **Job Queue**
   - Increase workers for Bull queue
   - Implement job prioritization
   - Set up job failure alerts

4. **Load Balancing**
   - Use load balancers for multiple instances
   - Implement session stickiness
   - Configure health checks

## Backup & Recovery

### Database Backup
```bash
# MongoDB Atlas - Automatic backups enabled
# Manual backup:
mongodump --uri "mongodb://user:pass@host:port/db" --out backup/
```

### Restore
```bash
mongorestore --uri "mongodb://user:pass@host:port/db" backup/
```

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] Redis password protected
- [ ] CORS properly configured
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] Sensitive data not logged
- [ ] Security headers configured
- [ ] Regular security updates done

## Troubleshooting

### Port Already in Use
```bash
# Find process on port
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Check connection string format
# mongodb://user:pass@host:port/db
```

### Redis Connection Failed
```bash
# Check Redis status
redis-cli ping

# Check Redis info
redis-cli info
```

### High Memory Usage
- Check for memory leaks
- Increase instance size
- Optimize queries
- Clear old job history

## Support

For deployment issues:
1. Check logs: `docker-compose logs` or `heroku logs --tail`
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review error messages carefully
