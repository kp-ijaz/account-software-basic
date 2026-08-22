const CACHE_NAME = 'madrasa-accounting-v1';
const OFFLINE_CACHE = 'madrasa-offline-v1';
const API_CACHE = 'madrasa-api-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Note: Some assets could not be cached during install', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('🧹 Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests separately
  if (url.pathname.startsWith('/api/')) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const cache = caches.open(API_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached API response on error
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('📦 Serving API response from cache:', url.pathname);
              return cached;
            }
            // Return offline response
            return new Response(
              JSON.stringify({
                success: false,
                message: 'You are offline. Please check your internet connection.',
                data: null,
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          // Clone response before using it
          const responseToCache = response.clone();

          // Cache successful responses
          if (response.ok && (
            request.destination === 'script' ||
            request.destination === 'style' ||
            request.destination === 'image' ||
            request.destination === 'document'
          )) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(API_CACHE).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Periodic background sync for offline data sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Attempt to sync pending transactions
      fetch('/api/sync', { method: 'POST' })
        .then((response) => {
          console.log('✅ Offline data synced');
          return response;
        })
        .catch(() => {
          console.log('⏳ Sync scheduled for later');
          // Will retry automatically
        })
    );
  }
});
