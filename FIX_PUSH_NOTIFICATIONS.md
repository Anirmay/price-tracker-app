# Fix Push Notification Subscription Error

## Problem
When clicking "Enable Push Notifications", you get:
```
AbortError: Registration failed - push service error
```

## Root Cause
The `NEXT_PUBLIC_VAPID_PUBLIC_KEY` environment variable is **not accessible to the frontend** during the Render build because it wasn't present in the environment at build time.

## Solution: Add VAPID Key to Render Dashboard

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your **`price-tracker-web`** service (the frontend)
3. Go to **Environment** tab

### Step 2: Add VAPID Public Key Variable
Click **"Add Environment Variable"** and add:

**Key:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

**Value:** 
```
BDNnlzwwFRROYnQsoDb2xu8EHbrelhJGpl-kKDB1BcASfZRC29t8anjJ_wRPMjcs1seQK2vFBEEKcqLakDVS4cU
```

Click **Save Changes**

### Step 3: Trigger Rebuild
1. Go to **Deploys** tab
2. Click **Manual Deploy**
3. Wait for the build to complete (should take 2-3 minutes)
4. Once deployment is done, you'll see a green checkmark

### Step 4: Test Push Notifications

1. **Hard refresh** the app: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Go to **Profile** page
3. Scroll to "Push Notifications" section
4. Click **"Enable Push Notifications"**
5. Click **"Allow"** in the browser permission dialog

## What Should Happen Now

✅ Permission dialog appears
✅ You click "Allow"
✅ Button changes to "Disable Push Notifications"
✅ Browser notification settings show "Enabled"

## If Still Not Working

### Check Browser Console
1. Press **F12** to open DevTools
2. Click **Console** tab
3. Click "Enable Push Notifications" again
4. Look for these log messages:

```
VAPID Public Key: Present
VAPID Key length: 87
Converting VAPID key to Uint8Array...
VAPID key converted successfully, length: 65
Service Worker registered successfully
Creating new push subscription with VAPID key...
Push subscription created successfully!
```

### If You See "VAPID Public Key: MISSING!"
- The environment variable didn't get set properly
- **Verify** it was actually added to Render dashboard
- Wait a few minutes for Render to update
- Try **Manual Deploy** again from Deploy tab
- Hard refresh the app and check console again

### If You See Conversion Error
- Something is wrong with the VAPID key value
- Copy the key value again (ensure no extra spaces):
```
BDNnlzwwFRROYnQsoDb2xu8EHbrelhJGpl-kKDB1BcASfZRC29t8anjJ_wRPMjcs1seQK2vFBEEKcqLakDVS4cU
```

### If Subscription Still Fails
Check the error message in console. Common errors:

| Error | Cause | Solution |
|-------|-------|----------|
| `Permission denied` | Browser permission not granted | Click "Allow" in permission dialog |
| `Invalid VAPID key` | Key format incorrect | Regenerate keys with `npx web-push generate-vapid-keys` |
| `Service Worker not found` | SW not registered | Clear browser cache and hard refresh |

## Testing After Fix

Once enabled successfully, create a test alert:

1. Go to **Dashboard**
2. Add a product you know you can get price updates for
3. Go to **Alerts**
4. Create an alert with a very low target price (e.g., ₹1)
5. Wait up to 30 minutes for price check to run
6. You should see a **browser notification** appear in the bottom right

**If you want to test immediately without waiting:**
- Backend price checks run every 30 minutes
- You can manually trigger one by adding a test product with a price you KNOW is higher than your alert target
- Go to any product page, add it, set alert for 50% lower than current price

## Summary

| Step | Action |
|------|--------|
| 1 | Open Render dashboard → price-tracker-web |
| 2 | Go to Environment tab |
| 3 | Add `NEXT_PUBLIC_VAPID_PUBLIC_KEY` variable with value above |
| 4 | Click Save Changes |
| 5 | Go to Deploys → Manual Deploy |
| 6 | Wait for green checkmark |
| 7 | Hard refresh app (`Ctrl+Shift+R`) |
| 8 | Test push notifications on Profile page |

That's it! Push notifications should work now.
