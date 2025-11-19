// Service Worker for Web Push Notifications
self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);
  
  if (!event.data) {
    console.log('[SW] Push event but no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[SW] Push data:', data);

    const options = {
      body: data.body,
      icon: '/icon-192.jpg',
      badge: '/icon-192.jpg',
      vibrate: [200, 100, 200],
      tag: data.tag || 'task-notification',
      requireInteraction: true,
      data: {
        url: data.url || '/app/calendar'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('[SW] Error handling push:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('install', function(event) {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(clients.claim());
});
