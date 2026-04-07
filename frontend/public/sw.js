// Service Worker for handling push notifications

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let data = {
    title: 'Price Tracker Alert',
    body: 'You have a new price alert!',
    icon: '/logo.png',
    badge: '/badge.png',
  };

  if (event.data) {
    try {
      data = JSON.parse(event.data.text());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/badge.png',
    tag: 'price-alert',
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  const productId = event.notification.data?.productId;

  if (productId) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes('/alerts')) {
            return client.focus();
          }
        }
        // Open app if not already open
        if (clients.openWindow) {
          return clients.openWindow(`/alerts/${productId}`);
        }
      })
    );
  }
});
