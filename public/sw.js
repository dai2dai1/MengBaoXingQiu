self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Simple pass-through for now, can be expanded to offline cache via CacheStorage
  event.respondWith(fetch(event.request));
});
