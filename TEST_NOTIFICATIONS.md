# Notification Testing Checklist

Use this checklist to verify all notification systems are working properly.

## Email Notifications ✉️

### Setup
- [ ] Gmail account created
- [ ] 2-Step Verification enabled on Gmail
- [ ] App password generated from Gmail
- [ ] Environment variables added to Render:
  - [ ] `EMAIL_SERVICE=gmail`
  - [ ] `EMAIL_USER=your-email@gmail.com`
  - [ ] `EMAIL_PASSWORD=xxxx xxxx xxxx xxxx`
  - [ ] `EMAIL_FROM=Price Tracker <noreply@pricetracker.com>`
- [ ] Backend restarted on Render
- [ ] Test email received in inbox (check spam too!)

### Test Procedure
1. [ ] Go to Profile → Notification Preferences
2. [ ] Enable "📧 Email Notifications"
3. [ ] Add a product with current price ₹X
4. [ ] Create alert: "Price drops ₹100"
5. [ ] Wait 30 minutes for price check
6. [ ] If price is now below target, email should arrive
7. [ ] Alternative: Manually update product price in database to test quickly

## Push Notifications 🔔

### Browser Support Check
- [ ] Chrome/Edge: ✅ Supported
- [ ] Firefox: ✅ Supported
- [ ] Safari 16+: ✅ Supported
- [ ] Mobile browsers tested

### Setup
- [ ] Service Worker file exists: `/public/sw.js`
- [ ] Push module exists: `/frontend/src/utils/pushNotifications.js`
- [ ] Profile page has push notification UI

### Test Procedure
1. [ ] Go to Profile → Notification Preferences  
2. [ ] Expand "🔔 Browser Push Notifications"
3. [ ] Click "Enable Push Notifications"
4. [ ] Grant browser permission when prompted
5. [ ] Verify status shows "✓ Push notifications enabled"
6. [ ] Create a price alert
7. [ ] Wait for price change or manually trigger alerts
8. [ ] Browser notification should appear even with app closed

### If Push Notifications Don't Work
- [ ] Check browser console for errors (F12 → Console)
- [ ] Verify browser notification permissions (address bar settings)
- [ ] Check browser supports Service Workers
- [ ] Try incognito/private window mode
- [ ] Clear browser cache and try again

## SMS Notifications 💬

### AWS SNS Setup (Recommended)
- [ ] AWS account created
- [ ] IAM user "sms-user" created  
- [ ] AmazonSNSFullAccess permission attached
- [ ] Access Key ID generated
- [ ] Secret Access Key generated
- [ ] Environment variables in Render:
  - [ ] `SMS_PROVIDER=aws-sns`
  - [ ] `AWS_ACCESS_KEY_ID=<key-id>`
  - [ ] `AWS_SECRET_ACCESS_KEY=<secret-key>`
  - [ ] `AWS_REGION=ap-south-1`

### Test Procedure for SMS
1. [ ] Go to Profile → Notification Preferences
2. [ ] Enable "💬 SMS Notifications"
3. [ ] Enter phone number with country code (e.g., +919876543210)
4. [ ] Create price alert
5. [ ] Wait for price change
6. [ ] SMS should arrive on your phone

## Notification Preferences ⚙️

### Verify All Settings in Profile
- [ ] Email notifications toggle works
- [ ] Push notifications toggle works (if browser supported)
- [ ] SMS notifications toggle works
- [ ] Phone number field shows when SMS enabled
- [ ] All three notification types shown in summary

## Alert Triggering 🎯

### Test Different Alert Types

#### Price Drop Alert
- [ ] Create alert for "Price drops"
- [ ] Wait 30 minutes or manually trigger price check
- [ ] Should notify when price < previous price

#### Percentage Drop Alert  
- [ ] Create alert for "5% price drop"
- [ ] Current: ₹1000, Target: 5% drop = ₹950
- [ ] Price changes to ₹940 (5.9% drop)
- [ ] Should trigger notification

#### Price Target Alert
- [ ] Create alert for "Price reaches ₹500"
- [ ] Current price: ₹600
- [ ] Price drops to ₹500
- [ ] Should trigger notification

#### Back in Stock Alert
- [ ] Create alert for "Product back in stock"
- [ ] Mark product as out of stock
- [ ] Price check runs, product is back in stock
- [ ] Should trigger notification

## Database Verification 🗄️

### Check Notifications Created
1. [ ] MongoDB → Database → Notifications collection
2. [ ] Should see documents with:
   - [ ] `status: "pending"` or `status: "sent"`
   - [ ] `title`, `message` fields populated
   - [ ] `userId`, `productId`, `alertId` references

### Check Alerts Updated  
1. [ ] MongoDB → Database → PriceAlerts collection
2. [ ] Should see:
   - [ ] `isActive: true` for enabled alerts
   - [ ] `lastTriggeredAt` timestamp
   - [ ] `alertType` matching your settings

## Performance Check ⚡

- [ ] Price check job runs every 30 minutes (check logs)
- [ ] Notification job runs every 5 minutes (check logs)
- [ ] No error messages in Render logs
- [ ] Backend not crashing during job runs
- [ ] Email sending succeeds (check logs for "Email sent:")

## Logs to Monitor

Open Render dashboard → Select `price-tracker-api` → **Logs** tab

Look for:
- [ ] `"Starting price check job..."`
- [ ] `"Price check job completed"`
- [ ] `"Processing pending notifications..."`
- [ ] `"Email sent: <message-id>"`
- [ ] `"Notification sent: <notification-id>"`
- [ ] `"Alert triggered for product <product-id>"`

If you see errors, note them for debugging!

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Email not sent | Check EMAIL_USER and EMAIL_PASSWORD in Render env |
| "Invalid email" error | Verify app password is 16 characters without extra spaces |
| Gmail rejecting | Enable "Less secure apps" or use App Password |
| Push notifications not showing | Check browser has Service Worker permission |
| Alerts not triggering | Check PRICE_CHECK_INTERVAL is set correctly, verify alert conditions |
| No logs appearing | Restart backend service on Render |

## Final Verification

When everything is working:

✅ Email arrives in inbox when alerts trigger
✅ Push notifications show in browser
✅ SMS texts arrive on phone (if configured)
✅ User sees notification preferences in profile
✅ Notifications appear in "Notifications" page
✅ No errors in Render logs
✅ Price updates every 30 minutes
✅ All alert types working correctly

**Congratulations! Your notification system is fully operational!** 🎉
