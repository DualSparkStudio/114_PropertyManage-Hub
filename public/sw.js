// Service Worker for caching and faster navigation
const CACHE_NAME = 'propertymanage-v1'
const RUNTIME_CACHE = 'runtime-v1'

// Get base path from current location
const BASE_PATH = self.location.pathname.split('/').slice(0, 2).join('/') || ''

// Helper to normalize paths
function normalizePath(path) {
  if (path.startsWith('/')) {
    return BASE_PATH + path
  }
  return path
}

// Assets to cache immediately
const PRECACHE_ASSETS = [
  normalizePath('/'),
  normalizePath('/explore'),
  normalizePath('/explore/rooms'),
  normalizePath('/explore/attractions'),
  normalizePath('/explore/features'),
  normalizePath('/explore/about'),
  normalizePath('/explore/contact'),
  normalizePath('/admin'),
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          })
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return

  // Normalize request URL for GitHub Pages
  const url = new URL(event.request.url)
  if (BASE_PATH && !url.pathname.startsWith(BASE_PATH)) {
    url.pathname = BASE_PATH + url.pathname
  }

  event.respondWith(
    caches.match(url).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache the response
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(url, responseToCache)
        })

        return response
      })
    })
  )
})

