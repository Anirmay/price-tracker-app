/**
 * SMS Notification Service
 * PRIMARY: AWS SNS (100 free SMS/month, then $0.0075 each)
 * FALLBACK: Twilio (paid, ~$0.0075-$0.015 per SMS)
 * 
 * ===== RECOMMENDED: AWS SNS (FREE) =====
 * SETUP INSTRUCTIONS:
 * 1. Create AWS account (free tier): https://aws.amazon.com/free
 * 2. Enable SNS: Go to AWS SNS Console → Create mobile app → Get credentials
 * 3. Add to .env:
 *    - SMS_PROVIDER=aws-sns
 *    - AWS_ACCESS_KEY_ID=your_access_key
 *    - AWS_SECRET_ACCESS_KEY=your_secret_key
 *    - AWS_REGION=ap-south-1 (for India)
 * 4. Run: npm install aws-sdk
 * 5. Users can enable SMS in their profile with Indian phone number
 * 
 * BENEFITS: 100 free SMS per month, forever free tier
 * 
 * ===== OPTIONAL: Twilio (Paid) =====
 * If you prefer Twilio instead of AWS SNS:
 * 1. Create Twilio account: https://www.twilio.com/console
 * 2. Add to .env:
 *    - SMS_PROVIDER=twilio
 *    - SMS_ACCOUNT_SID=your_account_sid
 *    - SMS_AUTH_TOKEN=your_auth_token
 *    - SMS_FROM_NUMBER=+your_twilio_number
 * 3. Run: npm install twilio
 */

let awsSNS = null;
let twilio = null;

// Try to load AWS SNS
try {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const AWS = require('aws-sdk');
    awsSNS = new AWS.SNS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'ap-south-1'
    });
    console.log('✅ AWS SNS loaded successfully (100 free SMS/month)');
  }
} catch (error) {
  console.log('⚠️  AWS SNS not available. Run: npm install aws-sdk');
}

// Try to load Twilio as fallback
try {
  if (process.env.SMS_ACCOUNT_SID && process.env.SMS_AUTH_TOKEN && process.env.SMS_PROVIDER === 'twilio') {
    twilio = require('twilio');
    console.log('✅ Twilio loaded as fallback SMS provider');
  }
} catch (error) {
  console.log('Twilio not installed. Run: npm install twilio');
}

/**
 * Send SMS via AWS SNS (preferred) or Twilio (fallback)
 */
const sendSMS = async (phoneNumber, message) => {
  try {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      console.error('❌ Invalid phone number provided for SMS');
      return false;
    }

    // Ensure phone number has country code
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

    // Try AWS SNS first (free tier preferred)
    if (awsSNS && process.env.SMS_PROVIDER !== 'twilio') {
      try {
        const params = {
          Message: message,
          PhoneNumber: formattedNumber,
        };
        
        const response = await awsSNS.publish(params).promise();
        console.log(`✅ SMS sent via AWS SNS (MessageId: ${response.MessageId})`);
        return true;
      } catch (error) {
        console.error('❌ AWS SNS Error:', error.message);
        // Continue to try Twilio if available
      }
    }

    // Fallback to Twilio
    if (twilio && process.env.SMS_FROM_NUMBER) {
      try {
        const client = twilio(
          process.env.SMS_ACCOUNT_SID,
          process.env.SMS_AUTH_TOKEN
        );

        const response = await client.messages.create({
          body: message,
          from: process.env.SMS_FROM_NUMBER,
          to: formattedNumber,
        });

        console.log(`✅ SMS sent via Twilio (${response.sid})`);
        return true;
      } catch (error) {
        console.error('❌ Twilio Error:', error.message);
      }
    }

    // No SMS provider configured
    if (!awsSNS && !twilio) {
      console.log('⚠️  SMS not configured. Choose one option:');
      console.log('\n📱 OPTION 1 (Recommended - FREE): AWS SNS');
      console.log('   1. Create AWS account: https://aws.amazon.com/free');
      console.log('   2. Get credentials from IAM');
      console.log('   3. Add to .env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION');
      console.log('   4. Run: npm install aws-sdk');
      console.log('   ✅ Gets 100 free SMS/month forever');
      console.log('\n💳 OPTION 2 (Paid): Twilio');
      console.log('   1. Sign up: https://www.twilio.com');
      console.log('   2. Add to .env: SMS_ACCOUNT_SID, SMS_AUTH_TOKEN, SMS_FROM_NUMBER');
      console.log('   3. Run: npm install twilio');
      console.log('   ❌ Paid at $0.0075-$0.015 per SMS');
    }

    return false;

  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    return false;
  }
};

module.exports = { sendSMS };

