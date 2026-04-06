# AWS SNS FREE SMS Setup Guide (100 free SMS/month)

> **Why AWS SNS over Twilio?** You get 100 free SMS every month, FOREVER. After that, only $0.0075 per SMS (cheapest option). Twilio trial ends, then you pay fully.

---

## 🎯 Quick Summary

| Feature | AWS SNS | Twilio | Twilio Trial |
|---------|---------|--------|-------------|
| **Free SMS/month** | 100 ✅ | 0 ❌ | 150-300 (limited) |
| **Permanent Free Tier** | YES ✅ | NO ❌ | Expires in days |
| **Cost after free** | $0.0075/SMS | $0.0075/SMS | Full price |
| **Setup time** | 10 mins | 5 mins | 5 mins |
| **Best for** | Production | Budget | Testing only |

---

## ✅ Step-by-Step AWS SNS Setup (10 minutes)

### Step 1: Create AWS Account (2 minutes)

1. Go to **https://aws.amazon.com/free/**
2. Click **"Create a free account"**
3. Enter email and password
4. Complete phone verification
5. Add credit card (won't be charged for free tier)
6. Verify and sign in

### Step 2: Create IAM User for SMS (3 minutes)

AWS requires a dedicated user for SMS to keep your main account secure.

1. Sign in to AWS Console: **https://console.aws.amazon.com**
2. Search for **"IAM"** in the search bar
3. Click **"Users"** in the left sidebar
4. Click **"Create user"**
5. **User name:** `sms-user`
6. Click **"Next"**
7. Click **"Attach policies directly"**
8. Search for and select: **`AmazonSNSFullAccess`**
9. Click **"Next"** → **"Create user"**

### Step 3: Generate Access Keys (2 minutes)

1. Click on the newly created **`sms-user`**
2. Go to **"Security credentials"** tab
3. Scroll down to **"Access keys"**
4. Click **"Create access key"**
5. Select **"Application running outside AWS"** (Command Line Interface)
6. Click **"Next"**
7. Click **"Create access key"**
8. **IMPORTANT:** Click **"Show"** and copy both:
   - **Access Key ID** (starts with `AKIA...`)
   - **Secret Access Key** (long random string)
9. Save these securely (you'll need them)

### Step 4: Configure Your App (3 minutes)

1. Open project: `c:/Users/HP/Desktop/Programming/GFG Bypass/backend/.env`

2. Find the SMS section and replace with your credentials:

```bash
# SMS NOTIFICATIONS - AWS SNS (FREE)
SMS_PROVIDER=aws-sns
AWS_ACCESS_KEY_ID=AKIA...your_key_here...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/your_secret_here...
AWS_REGION=ap-south-1
```

3. Save the file

### Step 5: Install AWS SDK (1 minute)

```bash
cd "c:/Users/HP/Desktop/Programming/GFG Bypass/backend"
npm install aws-sdk
```

**Output should show:**
```
added 1 package
```

### Step 6: Restart Backend Server

```bash
npm run dev
```

**Look for this message:**
```
✅ AWS SNS loaded successfully (100 free SMS/month)
```

---

## 🧪 Test SMS Delivery

### Option 1: Enable SMS in Profile (Easiest)

1. Open **http://localhost:3008**
2. Login to your account
3. Go to **Profile** page
4. Scroll to **"SMS Notifications"** section
5. Enter your phone number (e.g., `9876543210` or `+919876543210`)
6. Check the **"Enable SMS"** checkbox
7. Click **"Save Settings"**

### Option 2: Create Test Alert

1. Add a product to track (e.g., an Amazon item)
2. Create an alert with your phone number
3. Wait 5 minutes - you should receive an SMS

---

## 💰 Pricing Calculator

**AWS SNS SMS Pricing (India):**

| Volume | Cost |
|--------|------|
| 1-100 SMS/month | FREE ✅ |
| 101-1000 SMS/month | $0.0075 × (SMS - 100) = ~$6.75 |
| 1000+ SMS/month | $0.0075 × SMS |

**Example:**
- 50 alerts/month → FREE
- 150 alerts/month → (150-100) × $0.0075 = $0.375 (less than $1)
- 500 alerts/month → (500-100) × $0.0075 = $3

---

## ❌ Troubleshooting

### "AWS SNS not available"

**Solution:** Install AWS SDK
```bash
npm install aws-sdk
```

Then restart:
```bash
npm run dev
```

### "Invalid AWS credentials"

**Check:**
1. Copy-paste credentials exactly (no extra spaces)
2. Make sure `SMS_PROVIDER=aws-sns` (not `twilio`)
3. Region should be `ap-south-1` for India
4. User has `AmazonSNSFullAccess` permission

**Solution:**
```bash
# Delete old credentials and create new ones
# Go to IAM → sms-user → Security credentials → Delete old access key → Create new one
```

### SMS not sending

**Solution:**
1. Check backend logs for errors
2. Verify phone number format (`+91` prefix)
3. Check AWS billing: https://console.aws.amazon.com/billing

### "Cannot find module 'aws-sdk'"

**Solution:**
```bash
cd backend
npm install
npm run dev
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** to GitHub
   ```bash
   # Make sure .env is in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use IAM user** (don't use root credentials)

3. **Rotate keys** monthly
   - Delete old access key
   - Create new one

4. **Limit permissions**
   - `AmazonSNSFullAccess` scope is sufficient
   - Don't use more permissions

5. **Monitor costs**
   - Go to AWS Billing: https://console.aws.amazon.com/billing
   - Set up billing alerts

---

## 📱 Using AWS SNS in Your Code

The code is already integrated! Just enable SMS in the profile:

1. User enables SMS notifications in **Profile** page
2. When an alert triggers, it calls `smsService.sendSMS()`
3. AWS SNS sends SMS instantly
4. User receives notification on their phone

---

## 🚀 Switching Back to Twilio (if needed)

If you later want to use Twilio:

1. Update `.env`:
```bash
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=your_sid
SMS_AUTH_TOKEN=your_token
SMS_FROM_NUMBER=+1234567890
```

2. Install Twilio:
```bash
npm install twilio
```

3. Restart backend

---

## 📞 Support

- **AWS SNS Docs:** https://docs.aws.amazon.com/sns/
- **AWS Free Tier:** https://aws.amazon.com/free
- **Pricing Calculator:** https://calculator.aws

---

## ✨ Summary

✅ **You now have:**
- Free SMS notifications (100/month)
- No credit card charges for free tier
- Permanent free access to SMS
- Cheap SMS after free tier ($0.0075 each)
- Production-ready SMS service

**Next steps:**
1. Create AWS account (2 mins)
2. Create IAM user (3 mins)
3. Get credentials (2 mins)
4. Update .env (2 mins)
5. npm install aws-sdk (1 min)
6. Restart backend (1 min)
7. Enable SMS in profile (1 min)

**Total time:** ~15 minutes to get FREE SMS working! 🎉
