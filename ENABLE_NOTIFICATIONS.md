# 🚀 How to Enable Notifications (Quick Start)

Your app now has **3 types of notifications**! Here's how to enable them:

## 1️⃣ Email Notifications (Easiest!)

### In 3 Steps:
1. **Get Gmail App Password**
   - Go to https://myaccount.google.com → Security
   - Enable 2-Step Verification (if not done)
   - Go to App passwords → select Mail & your device
   - Copy the 16-char password

2. **Add to Render Dashboard**
   - Go to https://dashboard.render.com
   - Click `price-tracker-api` service
   - Go to Environment
   - Add 4 variables:
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=youremail@gmail.com
     EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
     EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
     ```
   - Click Save

3. **Test It**
   - Go to your app → Profile → Notification Preferences
   - Enable "📧 Email Notifications"
   - Add a product alert
   - Check email in 30 minutes (when price check runs)
   - **You'll get an email when alert triggers!**

## 2️⃣ Browser Push Notifications (Cool!)

### In 2 Steps:
1. **Open Profile Page**
   - Go to your app → Profile
   - Scroll to "🔔 Browser Push Notifications"
   - Click **"Enable Push Notifications"**
   - Grant permission when asked

2. **You're Done!**
   - Browser notifications will show even when app is closed
   - You'll see notifications when prices change

## 3️⃣ SMS Notifications (Optional Advanced)

Requires AWS or Twilio setup - see [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for details.

---

## ✅ What You'll Get

When an alert triggers:

### Email
```
Subject: iPhone 15 - Price Alert
Body: Price reached your target of ₹45,000!
      Current Price: ₹42,999
      [View Product Link]
```

### Browser Push (even app closed!)
```
📱 Price Tracker
   iPhone 15 - Price Alert
   Price dropped 12%! New price: ₹42,999
```

### SMS (if configured)
```
iPhone 15 - Price Alert: Price reached your target of ₹45,000! www.amazon.in/...
```

---

## 🔍 Check If It's Working

1. Go to Render Dashboard
2. Click `price-tracker-api` → Logs
3. You should see messages like:
   - `"Starting price check job..."`
   - `"Email sent: message-id-xxx"`
   - `"Alert triggered"`

## ❓ Troubleshooting

**Email not received?**
- Check spam folder
- Verify password is correct (16 characters)
- Check backend logs for errors

**Push not working?**
- Only works in Chrome, Firefox, Edge, Safari 16+
- Check browser notification permission
- Try clearing cache

**Still not working?**
- See detailed guide: [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md)
- Check testing guide: [TEST_NOTIFICATIONS.md](./TEST_NOTIFICATIONS.md)

---

**That's it! Enjoy your notifications!** 📬📱📞
