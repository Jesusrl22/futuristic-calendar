import { NextResponse } from 'next/server'

export async function GET() {
  const serviceWorkerCode = `
// Service Worker para Web Push Notifications
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activado');
  event.waitUntil(self.clients.claim());
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recibido:', event);
  
  if (!event.data) {
    console.log('[SW] No hay datos en el push');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[SW] Datos del push:', data);
    
    const options = {
      body: data.body || 'Tienes una nueva notificación',
      icon: data.icon || '/icon-192.jpg',
      badge: '/icon-192.jpg',
      tag: data.tag || 'task-notification',
      requireInteraction: true,
      timestamp: Date.now(),
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'FutureTask', options)
    );
  } catch (error) {
    console.error('[SW] Error procesando push:', error);
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificación clickeada:', event);
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes('/app/calendar') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow('/app/calendar');
      }
    })
  );
});
`;

  return new NextResponse(serviceWorkerCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/',
    },
  })
}
