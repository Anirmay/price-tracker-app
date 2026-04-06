# 🚀 Deploy YOUR Repo to Render NOW

**Your GitHub Repo:** https://github.com/Anirmay/price-tracker-app.git

---

## ⚡ Deploy in 8 Minutes (No code changes needed!)

✅ Your repo is ready to deploy as-is!

---

## 🎯 Step 1: Create Render Account (2 minutes)

1. Go to: **https://render.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Click **"Authorize render-oss"**
5. Complete signup
6. You're logged in! ✅

---

## 🔧 Step 2: Deploy Backend Service (2 minutes)

### 2.1 Create Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** under GitHub
4. Find and select: **`price-tracker-app`**
5. Click **"Connect"**

### 2.2 Configure Backend

Fill in these exact fields:

- **Name:** `price-tracker-api`
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `node backend/src/index.js`
- **Instance Type:** `Free`

Click **"Create Web Service"** ← THIS STARTS DEPLOYMENT

⏳ **Wait for backend to deploy (will show "Live" status)**

### 2.3 Add Backend Environment Variables

While it's deploying:

1. Click the **`price-tracker-api`** service
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Paste all 15 variables below:

```
NODE_ENV=production
PORT=5003
MONGODB_URI=mongodb+srv://anirmaykhan_db_user:4wMtlRNQgVE1BNFD@cluster0.7icmuxe.mongodb.net/price-tracker?appName=Cluster0
JWT_SECRET=change_this_to_random_secure_string
REDIS_HOST=redis-14782.crce206.ap-south-1-1.ec2.cloud.redislabs.com
REDIS_PORT=14782
REDIS_PASSWORD=SPiMqDubcWxvru2udNM8mOjhi8Ikb6M3
REDIS_USERNAME=default
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_gmail_app_password
EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
FRONTEND_URL=https://price-tracker-web.onrender.com
PRICE_CHECK_INTERVAL=21600000
NOTIFICATION_INTERVAL=300000
LOG_LEVEL=info
```

✅ **Backend deployed! Note the URL:** `https://price-tracker-api.onrender.com`

---

## 🎨 Step 3: Deploy Frontend Service (2 minutes)

### 3.1 Create Second Service

1. Click **"New +"** button again
2. Select **"Web Service"**
3. Select **`price-tracker-app`** repo
4. Click **"Connect"**

### 3.2 Configure Frontend

Fill in these exact fields:

- **Name:** `price-tracker-web`
- **Environment:** `Node`
- **Build Command:** `cd frontend && npm install && npm run build`
- **Start Command:** `cd frontend && npm start`
- **Instance Type:** `Free`

Click **"Create Web Service"** ← FRONTEND DEPLOYMENT STARTS

### 3.3 Add Frontend Environment Variables

1. Click the **`price-tracker-web`** service
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add these 2 variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://price-tracker-api.onrender.com
```

⏳ **Wait for frontend to show "Live" (3-5 minutes)**

---

## ✨ Step 4: Your App is LIVE! (1 minute)

When frontend shows green **"Live"** status:

**Open:** `https://price-tracker-web.onrender.com`

🎉 **YOUR APP IS NOW LIVE!**

---

## 🧪 TEST Your Deployed App

1. Visit: `https://price-tracker-web.onrender.com`
2. Click **"Sign Up"**
3. Create test account with email & password
4. Add a product (search Amazon/Flipkart)
5. Create a price alert
6. **Wait 5 minutes**
7. Check your email for alert notification ✅

---

## 📊 What You Now Have

| Component | URL |
|-----------|-----|
| **Frontend** | https://price-tracker-web.onrender.com |
| **Backend API** | https://price-tracker-api.onrender.com |
| **Status** | ✅ LIVE |
| **Cost** | 💰 FREE |
| **Auto-Deploy** | ✅ Push to GitHub = Auto-deploy |

---

## 🔄 Auto-Deployment (Magic Part!)

**Every time you push to GitHub:**

```bash
git add .
git commit -m "my changes"
git push origin main
```

✅ Render **automatically**:
1. Detects the push
2. Pulls your latest code
3. Runs: `npm install && npm build`
4. Restarts the server
5. Your live site updates! 🚀

**No manual work needed!**

---

## ⚠️ Common Issues & Fixes

### "Deployment Failed" Error

**Check Logs:**
1. Go to Render dashboard
2. Click your service name
3. Click **"Logs"** tab
4. Look for error message
5. Fix and push again

### "Cannot GET /" Error

**Solution:** Check that frontend env var `NEXT_PUBLIC_API_URL` is set correctly

### Email Not Sending

**Check:**
1. EMAIL_USER is correct
2. EMAIL_PASSWORD is 16-char Gmail app password (not regular password)
3. Gmail has 2FA enabled

### Long Deploy Time

**Normal!** First deploy takes 5-10 minutes because:
- docker builds your images
- Installs all dependencies
- Compiles Next.js

Subsequent deploys are faster (1-2 min)

---

## 📱 Enable SMS Later (Optional)

When ready for free SMS (100/month):

1. Follow: `AWS_SNS_FREE_SMS_GUIDE.md`
2. Get AWS credentials
3. Add to Render `price-tracker-api` environment:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION=ap-south-1`
4. Render auto-redeploys ✅

---

## 🎯 What's Included

```
✅ User Authentication (register/login)
✅ Product Tracking (Amazon/Flipkart)
✅ 4 Alert Types (price drop, %, target, back-in-stock)
✅ Email Notifications (Gmail SMTP)
✅ Push Notifications (browser alerts)
✅ SMS Ready (setup later with AWS SNS)
✅ Background Jobs (6-hour price checks, 5-min notifications)
✅ MongoDB Database (Atlas cloud)
✅ Redis Queue (job processing)
✅ HTTPS/SSL (auto with Render)
✅ Auto-deploy (on each GitHub push)
```

---

## 🚀 Next Steps (After Deploy)

1. **✅ Test the app** - Sign up and create alert
2. **❓ Enable SMS** - Follow AWS guide when ready
3. **📊 Monitor** - Check Render logs occasionally
4. **🔄 Update** - Just `git push origin main`, auto-deploys!

---

## 💡 Pro Tips

**Tip 1:** Monitor your app in production
```
Render Dashboard → Logs tab → Watch real-time logs
```

**Tip 2:** Restart if something breaks
```
Render Dashboard → Click service → Manual Deploy
```

**Tip 3:** Check your costs
```
Render Dashboard → Billing (should show $0 for free tier)
```

**Tip 4:** Share your live URL
```
Send to friends: https://price-tracker-web.onrender.com
```

---

## ✅ Deployment Checklist

- [ ] Created Render account
- [ ] Created backend service (`price-tracker-api`)
- [ ] Added backend environment variables
- [ ] Created frontend service (`price-tracker-web`)
- [ ] Added frontend environment variables
- [ ] Both services showing "Live" (green status)
- [ ] Visited: `https://price-tracker-web.onrender.com`
- [ ] Signed up and tested
- [ ] Created an alert
- [ ] Received email notification

---

## 🎉 Done!

Your app is **LIVE** at: `https://price-tracker-web.onrender.com` 🌐

**Share the URL with anyone!** They can start tracking prices right now! ✨

---

## 📞 Need Help?

**Check these files for reference:**
- `GO_LIVE_NOW.md` - Complete overview
- `DEPLOY_RENDER.md` - Detailed guide with screenshots
- `AWS_SNS_FREE_SMS_GUIDE.md` - SMS setup (later)

**Render Support:** https://render.com/docs

---

**Congratulations! Your price tracker is now live! 🚀**
