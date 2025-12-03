// Service Worker for caching and faster navigation
// Version updated to force cache refresh
const CACHE_NAME = 'propertymanage-v2'
const RUNTIME_CACHE = 'runtime-v2'

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
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    }).then(() => {
      // Clear all 404 responses from cache
      return caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.keys().then((keys) => {
          return Promise.all(
            keys.map((request) => {
              return cache.match(request).then((response) => {
                if (response && response.status === 404) {
                  console.log('Removing cached 404:', request.url)
                  return cache.delete(request)
                }
              })
            })
          )
        })
      })
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

  // Skip RSC data requests (they don't exist in static export)
  if (event.request.url.includes('_rsc=') || event.request.url.includes('index.txt')) {
    return
  }

  // Normalize request URL for GitHub Pages
  const url = new URL(event.request.url)
  const originalPath = url.pathname
  
  // Add base path if needed
  if (BASE_PATH && !url.pathname.startsWith(BASE_PATH)) {
    url.pathname = BASE_PATH + url.pathname
  }

  event.respondWith(
    caches.match(url).then((cachedResponse) => {
      // If we have a cached response, check if it's valid
      if (cachedResponse) {
        // Don't serve cached 404s - always try network first for navigation requests
        if (cachedResponse.status === 404 && event.request.mode === 'navigate') {
          // Try network first for navigation requests
          return fetch(event.request).then((networkResponse) => {
            // If network succeeds, cache it
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone()
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(url, responseToCache)
              })
            }
            return networkResponse
          }).catch(() => {
            // If network fails, return cached response
            return cachedResponse
          })
        }
        return cachedResponse
      }

      // No cache, try network
      return fetch(event.request).then((response) => {
        // Don't cache 404s or invalid responses
        if (!response || response.status === 404 || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache the response
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(url, responseToCache)
        })

        return response
      }).catch((error) => {
        // Network error - try to serve from cache even if it's a 404
        // This prevents showing network errors when offline
        return caches.match(url).then((fallbackResponse) => {
          if (fallbackResponse) {
            return fallbackResponse
          }
          // Return a basic 404 response if nothing is cached
          return new Response('Not Found', { status: 404, statusText: 'Not Found' })
        })
      })
    })
  )
})

