const CACHE_NAME = 'vr-explorer-cache-v1';
const urlsToCache = [
  '/',
  '/ExplorerTest15/index.html',
  '/ExplorerTest15/manifest.json',
  '/ExplorerTest15/icons/icon-192.png',
  '/ExplorerTest15/icons/icon-512.png',
  'https://aframe.io/releases/1.4.2/aframe.min.js'
  // Note: Optionally, you can pre-cache small MP4s if desired
];

// Install Service Worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate SW and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      )
    )
  );
});

// Intercept fetch requests and serve cached content if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response
        }
        return fetch(event.request); // Fetch from network
      })
  );
});
