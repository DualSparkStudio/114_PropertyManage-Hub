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

// DISABLED FETCH EVENT HANDLER TO PREVENT 404 ERRORS
// Service worker fetch handler was causing 404 errors
// For static export, we bypass service worker for navigation requests
self.addEventListener('fetch', (event) => {
  // Skip all navigation requests - let browser handle them directly
  // This prevents service worker from interfering with routing
  if (event.request.mode === 'navigate') {
    return // Let browser handle navigation
  }

  // Only handle non-navigation requests (assets, images, etc.)
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return
  if (event.request.url.includes('_rsc=') || event.request.url.includes('index.txt')) {
    return
  }

  // For assets, try network first, then cache
  event.respondWith(
    fetch(event.request).then((response) => {
      // Only cache successful responses
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone()
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache)
        })
      }
      return response
    }).catch(() => {
      // If network fails, try cache
      return caches.match(event.request)
    })
  )
})

