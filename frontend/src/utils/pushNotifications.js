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
    // Register service worker
    let registration;
    try {
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('Service Worker registered successfully');
    } catch (error) {
      // Service worker might already be registered
      registration = await navigator.serviceWorker.ready;
      console.log('Service Worker already registered');
    }

    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.error('VAPID public key not found');
      return null;
    }

    // Subscribe to push manager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Send subscription to backend
    await notificationService.subscribeToPush(subscription);

    console.log('Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
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
    return false;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
