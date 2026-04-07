import { notificationService } from '../services/api';

// Check if browser supports push notifications
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Check if user has already subscribed
export const isSubscribedToPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications not supported in this browser');
    return false;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else if (permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    } else if (permission === 'default') {
      console.log('Notification permission dismissed');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications not supported in this browser');
    return null;
  }

  try {
    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    console.log('========== VAPID KEY DIAGNOSTIC START ==========');
    console.log('VAPID Public Key:', vapidPublicKey ? 'Present' : 'MISSING!');
    if (vapidPublicKey) {
      console.log('VAPID Key length:', vapidPublicKey.length);
      console.log('VAPID Key first 20 chars:', vapidPublicKey.substring(0, 20));
      console.log('VAPID Key last 10 chars:', vapidPublicKey.substring(vapidPublicKey.length - 10));
      console.log('VAPID Key format valid (Base64 chars only):', /^[A-Za-z0-9_\-]+$/.test(vapidPublicKey));
    } else {
      console.error('VAPID public key not found in environment!');
      console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('VAPID')));
    }
    console.log('========== VAPID KEY DIAGNOSTIC END ==========');

    if (!vapidPublicKey) {
      console.error('VAPID public key not found in environment');
      throw new Error('Push notification service not configured. Please contact administrator.');
    }

    // Register service worker
    let registration;
    try {
      console.log('Registering service worker from /sw.js...');
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.log('Service Worker registration error, checking if already registered:', error.message);
      // Service worker might already be registered
      registration = await navigator.serviceWorker.ready;
      console.log('Service Worker already registered');
    }

    // Wait for service worker to be ready
    const sw = await navigator.serviceWorker.ready;
    console.log('Service Worker is ready');

    // Check current subscription
    let subscription = await sw.pushManager.getSubscription();
    
    if (subscription) {
      console.log('User is already subscribed');
      // Already subscribed, send to backend
      await notificationService.subscribeToPush(subscription);
      return subscription;
    }

    // Converting VAPID key
    console.log('Converting VAPID key to Uint8Array...');
    let applicationServerKey;
    try {
      applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log('✓ VAPID key converted successfully');
      console.log('  - Converted length:', applicationServerKey.length, 'bytes');
      console.log('  - Type:', applicationServerKey.constructor.name);
      console.log('  - First 10 bytes:', Array.from(applicationServerKey.slice(0, 10)));
    } catch (error) {
      console.error('✗ Error converting VAPID key:', error);
      console.error('  - Error message:', error.message);
      console.error('  - Error stack:', error.stack);
      throw new Error('Invalid VAPID key format: ' + error.message);
    }

    // Extra runtime diagnostics
    try {
      console.log('=== PUSH RUNTIME DIAGNOSTICS ===');
      console.log('  - navigator.userAgent:', navigator.userAgent);
      console.log('  - page origin:', location.origin);
      console.log('  - protocol:', location.protocol);
      console.log('  - service worker scope:', sw.scope);
      console.log('  - service worker active scriptURL:', registration && registration.active ? registration.active.scriptURL : 'none');

      if (typeof registration.pushManager.permissionState === 'function') {
        try {
          const perm = await registration.pushManager.permissionState({ userVisibleOnly: true, applicationServerKey: applicationServerKey });
          console.log('  - pushManager.permissionState:', perm);
        } catch (permErr) {
          console.warn('  - pushManager.permissionState() error:', permErr && permErr.message ? permErr.message : permErr);
        }
      } else {
        console.log('  - pushManager.permissionState() not supported in this browser');
      }
      console.log('=== END PUSH RUNTIME DIAGNOSTICS ===');

      // Subscribe to push manager
      console.log('Creating new push subscription with VAPID key...');
    } catch (diagErr) {
      console.warn('Diagnostics block error:', diagErr);
      console.log('Creating new push subscription with VAPID key...');
    }
    try {
      console.log('Push manager subscription options:');
      console.log('  - userVisibleOnly: true');
      console.log('  - applicationServerKey length: ' + applicationServerKey.length);
      
      subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
      
      console.log('✓ Push subscription created successfully');
      console.log('  - Subscription endpoint:', subscription.endpoint.substring(0, 50) + '...');
      console.log('  - P256DH key available:', !!subscription.getKey('p256dh'));
      console.log('  - Auth key available:', !!subscription.getKey('auth'));
    } catch (error) {
      console.error('✗ Push manager subscription FAILED');
      console.error('  - Error type:', error.constructor.name);
      console.error('  - Error name:', error.name);
      console.error('  - Error code:', error.code);
      console.error('  - Error message:', error.message);
      console.error('  - Full error:', error);
      
      // Better error messages
      if (error.message.includes('Registration failed')) {
        console.error('HINT: "Registration failed" usually means VAPID key issue');
        console.error('  - Check VAPID key is set in Render environment');
        console.error('  - Check VAPID key length: ' + vapidPublicKey.length + ' (should be ~87)');
        console.error('  - Check VAPID key has no extra spaces or newlines');
      }
      
      throw new Error('Browser push service error: ' + error.message);
    }

    // Send subscription to backend
    console.log('Sending subscription to backend...');
    try {
      await notificationService.subscribeToPush(subscription);
      console.log('Backend subscription successful');
    } catch (error) {
      console.error('Backend subscription error:', error);
      // Unsubscribe if backend fails
      await subscription.unsubscribe();
      throw new Error('Failed to register with server: ' + error.message);
    }

    console.log('Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    throw error;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Send unsubscribe to backend
      await notificationService.unsubscribeFromPush(subscription.endpoint);

      // Unsubscribe locally
      await subscription.unsubscribe();
      console.log('Push notification unsubscribe successful');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  try {
    console.log('[urlBase64ToUint8Array] Starting conversion...');
    console.log('  - Input length:', base64String.length);
    console.log('  - Input type:', typeof base64String);
    
    // Add padding
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    console.log('  - Padding characters needed:', padding.length);
    
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    console.log('  - After padding and char replacement:', base64.length);
    
    // Decode
    const rawData = window.atob(base64);
    console.log('  - Decoded raw data length:', rawData.length);
    
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    console.log('  - Final Uint8Array length:', outputArray.length);
    console.log('[urlBase64ToUint8Array] Conversion successful!');
    
    return outputArray;
  } catch (error) {
    console.error('[urlBase64ToUint8Array] FAILED - Conversion error:', error);
    console.error('  - Error:', error.message);
    throw new Error('Invalid VAPID key format: ' + error.message);
  }
}
