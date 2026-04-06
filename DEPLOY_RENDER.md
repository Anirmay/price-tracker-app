# 🚀 Deploy to Render (Live Server) - Complete Guide

> **What you'll get:** Your app live at `https://price-tracker-web.onrender.com` in 10 minutes, FREE

---

## ⚡ Quick Summary

| Step | Time | Status |
|------|------|--------|
| Create Render account | 2 mins | 🔲 TODO |
| Create backend service | 2 mins | 🔲 TODO |
| Create frontend service | 2 mins | 🔲 TODO |
| Set environment variables | 3 mins | 🔲 TODO |
| Deploy & verify | 1 min | 🔲 TODO |
| **TOTAL** | **~10 mins** | 🔲 START HERE |

---

## 📋 Prerequisites

Before you start, gather these credentials:

```
✅ MongoDB URI: mongodb+srv://anirmaykhan_db_user:4wMtlRNQgVE1BNFD@cluster0.7icmuxe.mongodb.net/price-tracker
✅ Redis credentials: redis-14782.crce206.ap-south-1-1.ec2.cloud.redislabs.com:14782
✅ GitHub account (free): https://github.com
✅ Your email for Render account
```

---

## 🎯 Step 1: Push Your Code to GitHub (3 minutes)

> **Why?** Render deploys from GitHub automatically. Every push = auto-deploy.

### 1.1 Create GitHub Repository

1. Go to **https://github.com/new**
2. **Repository name:** `price-tracker`
3. **Description:** GFG Price Tracker App
4. Select **"Public"** (Render can access it)
5. Click **"Create repository"**

### 1.2 Push Your Code

```bash
# Navigate to your project
cd c:\Users\HP\Desktop\Programming\GFG\ Bypass

# Initialize Git (first time only)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Price tracker app ready for deployment"

# Add GitHub URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/price-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 120, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🌐 Step 2: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easier)
4. Authorize Render to access your GitHub
5. Complete signup

**You're now in Render dashboard!** ✅

---

## 🔧 Step 3: Deploy Backend API (2 minutes)

### 3.1 Create New Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Select your **`price-tracker`** repo
4. Click **"Connect"**

### 3.2 Configure Backend Service

- **Name:** `price-tracker-api`
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `node backend/src/index.js`
- **Instance Type:** `Free`

### 3.3 Add Environment Variables

Click **"Add Environment Variable"** and add each:

```
NODE_ENV = production
PORT = 5003
MONGODB_URI = mongodb+srv://anirmaykhan_db_user:4wMtlRNQgVE1BNFD@cluster0.7icmuxe.mongodb.net/price-tracker
JWT_SECRET = your_super_secret_key_change_this
REDIS_HOST = redis-14782.crce206.ap-south-1-1.ec2.cloud.redislabs.com
REDIS_PORT = 14782
REDIS_PASSWORD = SPiMqDubcWxvru2udNM8mOjhi8Ikb6M3
EMAIL_SERVICE = gmail
EMAIL_USER = your_email@gmail.com
EMAIL_PASSWORD = [your 16-char app password]
EMAIL_FROM = Price Tracker <noreply@pricetracker.com>
SMS_PROVIDER = aws-sns
AWS_ACCESS_KEY_ID = [leave empty for now]
AWS_SECRET_ACCESS_KEY = [leave empty for now]
AWS_REGION = ap-south-1
FRONTEND_URL = https://price-tracker-web.onrender.com
PRICE_CHECK_INTERVAL = 21600000
NOTIFICATION_INTERVAL = 300000
LOG_LEVEL = info
VAPID_PUBLIC_KEY = [copy from frontend setup]
VAPID_PRIVATE_KEY = [copy from frontend setup]
```

### 3.4 Deploy

Click **"Create Web Service"**

**Wait for deployment (2-3 minutes)** ⏳

When complete, you'll see:
```
✓ Service live at: https://price-tracker-api.onrender.com
```

---

## 🎨 Step 4: Deploy Frontend App (2 minutes)

### 4.1 Create Another New Service

1. Click **"New +"** → **"Web Service"**
2. Select **`price-tracker`** repo again
3. Click **"Connect"**

### 4.2 Configure Frontend Service

- **Name:** `price-tracker-web`
- **Environment:** `Node`
- **Build Command:** `cd frontend && npm install && npm run build`
- **Start Command:** `cd frontend && npm start`
- **Instance Type:** `Free`

### 4.3 Add Environment Variables

Click **"Add Environment Variable"**:

```
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://price-tracker-api.onrender.com
```

### 4.4 Deploy

Click **"Create Web Service"**

**Wait for deployment (3-5 minutes)** ⏳

When complete:
```
✓ Service live at: https://price-tracker-web.onrender.com
```

---

## ✅ Step 5: Verify Deployment (1 minute)

### Check Backend API

Open in browser:
```
https://price-tracker-api.onrender.com/health
```

Should show:
```json
{
  "status": "ok",
  "timestamp": "2024-04-07T..."
}
```

### Check Frontend

Open in browser:
```
https://price-tracker-web.onrender.com
```

Should show your price tracker app! 🎉

### Test Login

1. Click **"Sign Up"**
2. Create test account
3. Add a product
4. Create an alert
5. Check your email (alert notifications)

---

## 🚀 Your Live App is Ready!

**Frontend:** `https://price-tracker-web.onrender.com` 🌐
**Backend API:** `https://price-tracker-api.onrender.com` 🔌
**Share with friends:** `https://price-tracker-web.onrender.com` ✨

---

## 📱 How Auto-Deployment Works

```
1. You push code to GitHub
   git push origin main

2. Render detects the push automatically

3. Render pulls latest code

4. Render runs: npm install && npm build

5. Render starts the app

6. Your live site updates automatically ✅
```

**No manual deployment needed!** Just push to GitHub.

---

## 🔧 Troubleshooting

### "Deployment Failed" Error

**Check logs:**
1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. Look for error message

**Common issues:**

| Error | Fix |
|-------|-----|
| `Cannot find module 'xyz'` | Missing `npm install` in Build Command |
| `MongoDB connection failed` | Check MONGODB_URI in env vars |
| `Port already in use` | Use PORT=5003 from env var |
| `Cannot GET /` | Check Start Command |

### Service Takes Too Long to Deploy

- Free tier is slower (1-3 mins is normal)
- Render spins down after 15 mins of inactivity
- First request after spin-down takes 30 secs
- Use **Render Events** (paid, $7/month) to prevent spindown

### Email Not Sending

1. Check Gmail 2FA is enabled
2. Verify App Password (16 chars, no spaces)
3. Check SMTP credentials in env vars
4. Test: Go to Profile → Add test email

---

## 💾 Update & Redeploy

**To deploy new changes:**

```bash
# Make changes locally
# Test on http://localhost:3008

# Commit changes
git add .
git commit -m "Fixed login bug"

# Push to GitHub
git push origin main

# Render auto-deploys! 
# Check status on Render dashboard
```

**No need to touch Render dashboard!**

---

## 🆚 Render vs Others

| Platform | Free? | Always On? | Ease | Setup |
|----------|-------|-----------|------|-------|
| **Render** ✅ | YES | YES | Easy | 10 mins |
| Heroku | $7+ | YES | Easy | 10 mins |
| Railway | $5+ | YES | Very Easy | 8 mins |
| AWS EC2 | YES* | YES | Hard | 30 mins |
| Vercel | YES | YES | Easy | 5 mins |

*AWS requires credit card + complex setup

---

## 📊 Free Tier Limits

**Render Free Tier Includes:**

- ✅ **2 web services** (Backend + Frontend)
- ✅ **512 MB RAM** per service
- ✅ **Shared CPU**
- ✅ **100 GB bandwidth/month**
- ✅ **Auto-HTTPS**
- ✅ **Auto-shutdown after 15 mins** (on paid tier, prevent with Events)
- ✅ **Git-based deployment**

**Perfect for:** Testing, portfolios, small projects

**Upgrade when:** You need persistent uptime (then $7/month)

---

## 🎯 Next Steps (After Deployment)

### 1️⃣ Enable Email Notifications (Already enabled)
```
Your Gmail credentials are in .env
Test by: Profile → Enable Emails → Create Alert
```

### 2️⃣ Enable SMS Notifications (Later)
```
Follow: AWS_SNS_FREE_SMS_GUIDE.md
Get AWS credentials → Add to Render env vars
```

### 3️⃣ Enable Push Notifications (Later)
```
Generate VAPID keys: npx web-push generate-vapid-keys
Add to Render env vars
Test: Profile → Enable Push Notifications
```

### 4️⃣ Add Custom Domain (Optional, Later)
```
Bring your domain to Render
Update DNS records
All automatic with Render!
```

---

## 💡 Pro Tips

### Tip 1: Monitor Your App
- Go to Render → Your service → **Logs** tab
- Watch real-time logs
- Troubleshoot issues instantly

### Tip 2: Environment Secrets
- Use **Encrypted Environment Variables** for secrets
- Never commit `.env` to GitHub
- Render auto-encrypts all secrets

### Tip 3: Manual Redeploy
- On Render dashboard
- Click your service
- Click **"Manual Deploy"**
- Useful if something breaks

### Tip 4: Scale Later
- Start on free tier (good enough for 100+ users)
- Upgrade to paid when needed ($7/month)
- Render grows with you

---

## 🚨 Important: Keep Secrets Safe

**.gitignore should have:**
```
.env
.env.local
.env.production
node_modules/
```

**Verify:**
```bash
git status
```

Should NOT show `.env` files! 🔒

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Your App Health:** Check Render dashboard logs
- **GitHub Issues:** Common errors documented there
- **MongoDB Status:** https://status.atlas.mongodb.com

---

## 🎉 You're Live!

Your app is now running on Render! 

**Share your URL:** `https://price-tracker-web.onrender.com` ✨

**Every push to GitHub = Auto-deploy** 🚀

**Enable SMS later with AWS SNS** 📱

Congrats! 🎊

