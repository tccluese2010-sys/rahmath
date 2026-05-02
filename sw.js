const CACHE_NAME = 'hotel-rahmath-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './rahmath.css',
  './rahmath.js',
  './manifest.json',
  './hero-bg.webp',
  './some_menus_need_202604241122.avif',
  './some_menus_need_202604241122.avif',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'
];

// Install: cache all assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', function(event) {
  // Skip non-GET and cross-origin requests like emailjs API calls
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function(networkResponse) {
        // Cache a fresh copy
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(function() {
        // Network failed, serve from cache
        return caches.match(event.request).then(function(cachedResponse) {
          if (cachedResponse) return cachedResponse;
          // Fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'inline-block';
});

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function(result) {
    if (result.outcome === 'accepted') {
      document.getElementById('installBtn').style.display = 'none';
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', function() {
  document.getElementById('installBtn').style.display = 'none';
  deferredPrompt = null;
});