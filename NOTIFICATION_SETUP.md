# Email Notification Setup Guide

Email notifications are now fully integrated! Follow these steps to enable them on your deployed app (Render).

## Step 1: Create a Gmail App Password

Gmail now requires App Passwords instead of your regular password for security. Here's how:

1. Go to [https://myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Once 2FA is enabled, you'll see **App passwords** option
5. Select **Mail** and **Windows Computer** (or your device)
6. Google will generate a **16-character password** like: `xxxx xxxx xxxx xxxx`
7. **Copy this password** - you'll need it in the next step

## Step 2: Add Email Credentials to Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your **price-tracker-api** backend service
3. Go to **Environment** → **Environment Variables**
4. Add/Update these variables:

```
EMAIL_SERVICE=gmail
EMAIL_USER=<your-gmail-address>@gmail.com
EMAIL_PASSWORD=<16-character-app-password-from-step-1>
EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
```

For example:
```
EMAIL_SERVICE=gmail
EMAIL_USER=anirmaykhan@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
```

5. Click **Save**
6. Your backend will automatically restart with the new configuration

## Step 3: Test Email Notifications

1. Open your app at https://price-tracker-web-xxx.onrender.com
2. Go to **Profile** → **Notification Preferences**
3. Make sure **Email Notifications** is enabled ✓
4. Add a product with a price alert
5. Wait for the next price check (every 30 minutes)
6. If the price condition is met, **you should receive an email**

## Step 4: Enable Push Notifications (Optional)

Push notifications show up in your browser even when the app is closed!

1. Go to **Profile** → **Notification Preferences**
2. Expand **🔔 Browser Push Notifications**
3. Click **Enable Push Notifications**
4. Grant browser permission when prompted
5. You'll now receive browser notifications when prices change

## Troubleshooting

### Email not received?
- Check your Gmail **Spam folder**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Make sure `EMAIL_SERVICE=gmail` is set
- Check backend logs for errors: In Render dashboard → Service → Logs

### Can't enable push notifications?
- Make sure your browser supports push notifications (Chrome, Firefox, Edge, Safari 16+)
- Check browser notification settings (usually in address bar settings)
- Clear browser cache and reload

### How to check if notifications are being sent?
1. Go to Render dashboard
2. Click on **price-tracker-api**
3. Go to **Logs**
4. Look for messages like:
   - `"Email sent: message-id"`
   - `"Notification processing completed"`
   - `"Alert triggered for product"`

## Email Notification Types

You'll receive emails for these events:

- **Price Drop**: When price goes down from previous check
- **Percentage Drop**: When price drops by your specified percentage
- **Target Price Reached**: When price goes to or below your target
- **Back in Stock**: When a product is available again

Each notification includes:
- Product name and current price
- What triggered the notification
- Direct link to the product

## SMS Notifications (Advanced)

SMS notifications require additional setup with AWS SNS or Twilio:

### Using AWS SNS (Recommended - 100 free SMS/month):
1. Create [AWS account](https://aws.amazon.com/free)
2. Go to IAM → Users → Create user named "sms-user"
3. Give it **AmazonSNSFullAccess** permission
4. Generate Access Key ID and Secret Access Key
5. Add to Render environment:
```
SMS_PROVIDER=aws-sns
AWS_ACCESS_KEY_ID=<your-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=ap-south-1
```

### Using Twilio (Paid service):
1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Add to Render environment:
```
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=<your-account-sid>
SMS_AUTH_TOKEN=<your-auth-token>
SMS_FROM_NUMBER=<your-twilio-number>
```

Then in your Profile, enter your phone number with country code (e.g., +91XXXXXXXXXX) and enable SMS.

## How The System Works

### Price Check Job (every 30 minutes)
1. Runs every 30 minutes on backend
2. Fetches current price from Amazon/Flipkart
3. Compares with previous price
4. Checks all active alerts against the price change
5. Creates notification records for matching alerts

### Notification Processing Job (every 5 minutes)
1. Finds pending notifications
2. Sends emails, push notifications, and SMS based on user preferences
3. Marks notifications as sent
4. Retries up to 3 times if failed

### Flow:
```
Product Price Changes
        ↓
Alert Triggered (if conditions met)
        ↓
Notification Created (pending status)
        ↓
User Preferences Checked
        ↓
Send Email ❌ → Push Notification ❌ → SMS ❌
```

## Need Help?

Check your notification settings in Profile:
- Enable/disable individual notification types
- Add phone number for SMS
- Subscribe to/from browser push notifications

All notification logs appear in Render dashboard logs for debugging!
