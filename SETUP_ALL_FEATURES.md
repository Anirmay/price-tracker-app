# 🚀 Setup Guide - Enable All Features

## Part 1: Email Notifications (Already Working!)

### Gmail Configuration (Optional - for custom emails)
1. Enable 2-Factor Authentication on Gmail
2. Visit: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character app password
5. Add to `backend/.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
   ```
6. Restart backend: `npm run dev`

**Result:** Custom emails will be sent from your Gmail account

---

## Part 2: Push Notifications (Ready to Use!)

### Browser Permissions
1. Go to Profile (in app)
2. Open "Notification Preferences" → "Browser Push Notifications"
3. Enable the checkbox
4. Save Changes
5. When alerts trigger, browser will show popup notifications

### Production Setup (Optional)
Generate VAPID keys:
```bash
cd backend
npx web-push generate-vapid-keys
```

Copy output and add to `backend/.env`:
```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

Restart backend.

---

## Part 3: SMS Notifications (Complete Setup Guide)

### Step 1: Create Twilio Account
1. Go to: https://www.twilio.com
2. Click "Sign Up" (Free account available)
3. Complete registration
4. Verify email and phone number
5. You'll get trial credits ($15+)

### Step 2: Get Credentials
1. Go to Twilio Console: https://www.twilio.com/console
2. Copy your **Account SID** (starts with AC...)
3. Copy your **Auth Token** (hidden, click to reveal)
4. Go to "Phone Numbers" → "Manage Active Numbers"
5. Buy a Twilio phone number (or use trial number)
6. Copy the phone number (format: +1234567890)

### Step 3: Configure Backend
Add to `backend/.env`:
```env
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMS_AUTH_TOKEN=your_auth_token_here
SMS_FROM_NUMBER=+1234567890
```

### Step 4: Install Twilio Package
```bash
cd backend
npm install twilio
```

### Step 5: Restart Backend
```bash
npm run dev
```

### Step 6: Enable SMS in App
1. Go to Profile (in app)
2. Open "Notification Preferences" → "SMS Notifications"
3. Enter your **phone number with country code**:
   - India: +91 9876543210
   - USA: +1 2025551234
   - UK: +44 2071838750
4. Check the "SMS Notifications" checkbox
5. Click "Save Changes"

### Verify SMS is Working
1. Create a price alert
2. Wait for background job to process (or manually trigger)
3. Check your phone for SMS message!

---

## Part 4: Web Push VAPID Keys (Production)

**For development:** Already configured with placeholder keys
**For production:** Generate your own

### Generate Keys
```bash
cd backend
npx web-push generate-vapid-keys
```

### Output Example
```
Public Key: BJ_ZQ94XYZ...
Private Key: 8aBcDeFGHi...
```

### Configure
Add to `backend/.env`:
```env
VAPID_PUBLIC_KEY=BJ_ZQ94XYZ...
VAPID_PRIVATE_KEY=8aBcDeFGHi...
```

Restart backend.

---

## Part 5: Price Check Scheduling

### Adjust How Often Prices Are Checked
Edit `backend/.env`:
```env
# Price check every 6 hours (production recommended)
PRICE_CHECK_INTERVAL=21600000

# For testing: Every 5 minutes
PRICE_CHECK_INTERVAL=300000

# Every 1 hour
PRICE_CHECK_INTERVAL=3600000
```

### Adjust Notification Processing
```env
# Process notifications every 5 minutes (production recommended)
NOTIFICATION_INTERVAL=300000

# For testing: Every 1 minute
NOTIFICATION_INTERVAL=60000
```

Restart backend after changes.

---

## Part 6: Verify All Features Working

### Email Alerts
- ✅ Create a price alert
- ✅ Check email (check spam folder too)
- ✅ Email should contain: Product name, price, link to buy

### Push Notifications
- ✅ Go to Profile, enable push notifications
- ✅ Grant browser permission
- ✅ Create a price alert
- ✅ Browser popup notification should appear

### SMS Alerts
- ✅ Add phone number in Profile
- ✅ Enable SMS notifications
- ✅ Create a price alert
- ✅ SMS should arrive on your phone

### Background Jobs
- ✅ Check backend logs for: "Starting price check job"
- ✅ Check logs for: "Processing pending notifications"
- ✅ Logs should show alerts being sent

---

## 🆘 Troubleshooting

### Emails not sent?
```
Problem: Gmail credentials wrong
Solution:
1. Go to: https://myaccount.google.com/apppasswords
2. Generate NEW 16-char password
3. Update .env with new password
4. Restart backend

Problem: Email notifications disabled
Solution:
1. Go to Profile → Notification Preferences
2. Check "Email Notifications"
3. Save changes
```

### SMS not received?
```
Problem: Not getting SMS from Twilio
Solution:
1. Verify SMS_ACCOUNT_SID is correct (starts with AC)
2. Verify SMS_AUTH_TOKEN is correct
3. Verify SMS_FROM_NUMBER is a valid Twilio number
4. Check your phone number has +country_code format
5. Verify SMS notifications enabled in Profile

Problem: Phone already has subscription?
Solution:
1. Twilio blocks SMS to existing subscribers
2. Try different phone number
3. Or use test number from Twilio console first

Problem: No Twilio credits?
Solution:
1. Go to Twilio console
2. Check account balance
3. Add credits if needed (pay-as-you-go)
```

### Push notifications not showing?
```
Problem: Browser permission denied
Solution:
1. Open Profile → Notification Preferences
2. Check "Browser Push Notifications"
3. Save
4. Browser will ask for permission
5. Click "Allow"
6. Test by creating a price alert

Problem: Different browser problem?
Solution:
1. Chrome/Brave: Usually works
2. Firefox: Usually works
3. Safari: May have limitations
4. Try another browser to test
```

### Background jobs not running?
```
Check backend logs should show:
✓ Starting price check job...
✓ Processing pending notifications...
✓ Price check job completed
✓ Notification processing completed

If not showing:
1. Backend might be restarting
2. Check if nodemon is watching files
3. Restart backend manually
4. Check .env PRICE_CHECK_INTERVAL and NOTIFICATION_INTERVAL
```

---

## 📋 Complete Feature Checklist

After setup, verify:
- [ ] Can add products from Amazon/Flipkart
- [ ] Can create 4 types of alerts
- [ ] Email notifications received
- [ ] Push notifications enabled and working
- [ ] SMS notifications set up and working
- [ ] Can view all alerts on Alerts page
- [ ] Can edit/delete alerts
- [ ] Price updates every 6 hours
- [ ] Notifications processed every 5 minutes
- [ ] Can log out and log back in without losing data

---

## 📱 Test Endpoints (Backend)

Test API endpoints directly:

```bash
# Check if backend is running
curl http://localhost:5003/health

# Login
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get your products
curl http://localhost:5003/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get your alerts
curl http://localhost:5003/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get notifications
curl http://localhost:5003/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎉 You're All Set!

All features are now configured and ready to use:

- 📧 **Email:** Always enabled
- 🔔 **Push:** Enable via Profile
- 💬 **SMS:** Set up via Twilio + Profile
- ⏰ **Auto-checking:** Runs every 6 hours
- 📨 **Auto-sending:** Runs every 5 minutes

Start tracking prices and getting alerts! 🚀
