/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

// Precaching all assets injected by Vite PWA
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  let data: any = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    console.error('Error parsing push data', e);
  }

  const title = data.title || 'Soraia';
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data;
  
  if (url) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});
