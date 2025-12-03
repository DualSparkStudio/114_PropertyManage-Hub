// Script to clear service worker cache and force refresh
// This helps resolve 404 issues caused by stale cache

(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    // Unregister all service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function(success) {
          if (success) {
            console.log('Service Worker unregistered');
          }
        });
      }
    });

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('All caches cleared');
        // Reload page after clearing cache
        setTimeout(function() {
          window.location.reload();
        }, 500);
      });
    }
  }
})();

