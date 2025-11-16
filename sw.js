const CACHE_NAME = 'vr-explorer-cache-v15';
const urlsToCache = [
  '/',
  '/ExplorerTest15/index.html',
  '/ExplorerTest15/manifest.json',
  '/ExplorerTest15/icons/icon-192.png',
  '/ExplorerTest15/icons/icon-512.png',
  'https://aframe.io/releases/1.4.2/aframe.min.js'
  // Videos are not cached due to size; they load from Cloudflare
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and remove old caches
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

// Intercept fetch requests and serve cached content
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
