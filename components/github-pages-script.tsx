"use client"

import { useEffect } from "react"

export function GitHubPagesScript() {
  useEffect(() => {
    // DISABLED SERVICE WORKER TO PREVENT 404 ERRORS
    // Service worker was causing 404 errors by caching incorrect responses
    // For static export, we don't need service worker caching
    
    if ('serviceWorker' in navigator) {
      // Unregister ALL service workers to prevent 404 issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Service worker unregistered to prevent 404 errors')
            }
          })
        })
      })
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              console.log('Deleting cache:', cacheName)
              return caches.delete(cacheName)
            })
          )
        })
      }
    }
  }, [])

  return null
}

