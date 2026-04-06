# Price Tracker - Complete Features Guide

## 🎯 All Implemented Features

### 1. **Product Tracking** ✅
- Add products via Amazon/Flipkart URLs
- Real-time price monitoring (every 6 hours)
- Automatic product scraping (image, name, price, stock status)
- Track multiple products simultaneously
- View product details and current price
- In Stock/Out of Stock status

### 2. **Price Alerts** ✅
Create custom price alerts with 4 types:

#### **a) Price Drop Alert** 🔴
- Alert when price drops by any amount
- Get notified immediately when price decreases
- Example: Alert if ₹1000 item drops to ₹900

#### **b) Percentage Drop Alert** 📉
- Alert when price drops by a specific percentage
- Example: Alert when price drops by 20%
- Useful for tracking seasonal sales

#### **c) Target Price Alert** 🎯
- Alert when price reaches a target amount
- Set your ideal purchase price
- Example: Alert when ₹1000 item reaches ₹750

#### **d) Back in Stock Alert** 📦
- Get alerted when out-of-stock product becomes available
- Never miss restocks of high-demand items

### 3. **Notification Channels** 📢

#### **Email Notifications** ✅ (READY)
**Current Status:** Configured and active
- Sends alerts to your registered email
- Includes: Product name, price, discount details
- Direct link to buy the product

**To enable:**
1. Notifications are enabled by default in Profile
2. You'll receive emails when alerts trigger

**For custom email setup (Gmail):**
1. Enable 2FA on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate App Password (16 characters)
4. Admin adds to backend `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
5. Restart backend

#### **Push Notifications** ✅ (READY)
**Current Status:** Available, ready to enable
- Real-time notifications in browser
- Works when app is open or closed
- Requires browser permission

**To enable:**
1. Go to Profile → Notification Preferences
2. Check "Browser Push Notifications"
3. Browser will ask for permission
4. Click "Allow" to receive notifications

**For production VAPID keys:**
1. Generate keys: `npx web-push generate-vapid-keys`
2. Admin adds to backend `.env`:
   ```
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```
3. Restart backend

#### **SMS Notifications** ⏳ (OPTIONAL - Requires Setup)
**Current Status:** Configured but requires Twilio setup
- Text message alerts to your phone
- Instant notifications on the go

**To enable SMS:**

**Step 1: Set up Twilio Account**
1. Sign up at: https://www.twilio.com
2. Create a free account (gets trial credits)
3. Get your Account SID and Auth Token from dashboard
4. Buy a Twilio phone number

**Step 2: Configure Backend**
1. Add to backend `.env`:
   ```
   SMS_PROVIDER=twilio
   SMS_ACCOUNT_SID=your_account_sid_here
   SMS_AUTH_TOKEN=your_auth_token_here
   SMS_FROM_NUMBER=+1234567890
   ```
2. Run: `npm install twilio` (if not already installed)
3. Restart backend

**Step 3: Enable in Profile**
1. Go to Profile → Notification Preferences
2. Add your phone number (with country code, e.g., +91 for India)
3. Check "SMS Notifications"
4. Save changes
5. Start receiving SMS alerts!

### 4. **Dashboard Features** ✅
- **Add Products:** Paste Amazon/Flipkart URLs
- **View Products:** See all tracked products with images
- **Quick Stats:** View current prices and savings
- **Product Actions:**
  - Set Alert - Create custom price alert
  - Delete - Stop tracking product

### 5. **Alerts Management** ✅
- **Alerts Page:** View all your active alerts
- **Alert Details:** Complete alert configuration and product info
- **Alert Actions:**
  - 🛒 Buy Product - Direct link to retailer
  - ✓ Activate/Deactivate - Control alert status
  - 🗑️ Delete - Remove alert

### 6. **Profile Management** ✅
- **Edit Name:** Update your full name
- **Phone Number:** Add for SMS notifications
- **Notification Settings:** Enable/disable each channel
- **Visual Summary:** See which notifications are active

### 7. **Authentication** ✅
- **Sign Up:** Create account with email/password
- **Login:** Secure JWT-based authentication
- **Session Persistence:** Stay logged in after refresh
- **Profile Access:** Only authenticated users can access app

### 8. **Background Jobs** ✅

#### **Price Check Job** ⏰
- Runs every 6 hours automatically
- Fetches latest prices from Amazon/Flipkart
- Detects price changes
- Compares against user alerts

#### **Notification Processing Job** 📨
- Runs every 5 minutes
- Processes pending notifications
- Sends via enabled channels (Email, Push, SMS)
- Retries failed notifications up to 3 times

### 9. **Data Persistence** ✅
- **MongoDB Atlas:** Cloud database for users, products, alerts
- **Redis Cloud:** Job queue and caching layer
- **Automatic Backups:** Daily MongoDB Atlas backups

---

## 📊 Feature Priority & Status

| Feature | Status | Setup Required |
|---------|--------|-----------------|
| Product Tracking | ✅ Active | None |
| 4 Alert Types | ✅ Active | None |
| Email Alerts | ✅ Active | None (Gmail optional) |
| Push Notifications | ✅ Ready | Browser permission |
| SMS Alerts | ⏳ Ready | Twilio setup required |
| Dashboard | ✅ Active | None |
| Alerts Page | ✅ Active | None |
| Profile Settings | ✅ Active | None |
| JWT Auth | ✅ Active | None |
| Price Jobs | ✅ Active | None |
| Notification Jobs | ✅ Active | None |

---

## 🚀 Quick Start Checklist

### Immediate (No Setup):
- ✅ Register account
- ✅ Add products from Amazon/Flipkart
- ✅ Create price alerts (all 4 types)
- ✅ Receive email notifications
- ✅ Enable push notifications (1-click in browser)

### Optional Enhancements:
- 📧 Configure Gmail SMTP for custom emails
- 💬 Set up Twilio for SMS notifications
- 🔐 Generate VAPID keys for production push notifications

---

## 📱 How Features Work Together

```
1. User adds Amazon product URL
   ↓
2. System scrapes product details
   ↓
3. User creates price alert
   ↓
4. Alert stored in MongoDB
   ↓
5. Every 6 hours: Price check job runs
   ↓
6. Price compared to alert conditions
   ↓
7. If triggered: Notification created
   ↓
8. Every 5 mins: Notification job runs
   ↓
9. Send via: Email + Push + SMS (if enabled)
   ↓
10. User receives alert on all channels
```

---

## 🔧 Configuration Locations

**Backend Config:**
- Port: `backend/.env` (`PORT=5003`)
- Database: `backend/.env` (`MONGODB_URI`)
- Redis: `backend/.env` (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)
- Email: `backend/.env` (EMAIL_* variables)
- SMS: `backend/.env` (SMS_* variables)
- Push: `backend/.env` (VAPID_* variables)

**Frontend Config:**
- API URL: `frontend/.env.local` (`NEXT_PUBLIC_API_URL`)

---

## 🆘 Troubleshooting

### Alerts not triggering?
1. Check background jobs are running (check backend logs)
2. Verify price check job finds your product
3. Check alert conditions are correct
4. Wait for next price check cycle (6 hours)

### Email notifications not arriving?
1. Check Gmail credentials are correct
2. Verify email notifications are enabled in Profile
3. Check spam/promotions folder
4. Production: Ensure SMTP settings are correct

### SMS not working?
1. Verify Twilio credentials in `.env`
2. Check phone number format (+country_code format)
3. Ensure SMS notifications enabled in Profile
4. Twilio: Check account balance and phone number validity

### Push notifications not showing?
1. Browser must have permission granted
2. Check browser notification settings
3. Ensure push notifications enabled in Profile
4. Try other browser if still not working

---

## 📈 What Gets Tracked

**For Each Product:**
- Product name
- Product image
- Current price (updated every 6 hours)
- Original price (for comparison)
- Stock status (In Stock / Out of Stock)
- Last updated timestamp
- Price history

**For Each Alert:**
- Alert type (price_drop, percentage_drop, price_target, back_in_stock)
- Associated product
- Target parameters (target price, % drop, etc.)
- Active status
- Triggered status and timestamp
- Creation timestamp

---

## 🔐 Data Privacy

- Passwords: Hashed with bcryptjs (industry standard)
- Phone numbers: Only shared with SMS provider when needed
- Emails: Only used for alert delivery
- Personal data: Never sold or shared
- Cloud services: MongoDB Atlas and Redis Cloud SOC 2 certified

---

## 💡 Pro Tips

1. **Set multiple alerts** on same product (e.g., price drop + target price)
2. **Monitor seasonal products** with back-in-stock alerts
3. **Use target price alerts** for items you're willing to buy at
4. **Enable all notifications** to not miss any deals
5. **Check alerts page regularly** to see alert history
6. **Update phone number** before enabling SMS

---

## 📞 Support

For issues or questions:
1. Check Profile → Notification Preferences for setup status
2. Review logs in Alerts page for alert history
3. Test each notification channel individually
4. Verify backend is running: Check port 5003
5. Clear browser cache if UI issues persist

Happy price tracking! 🎉
