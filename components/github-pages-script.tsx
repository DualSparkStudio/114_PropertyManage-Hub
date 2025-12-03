"use client"

import { useEffect } from "react"

export function GitHubPagesScript() {
  useEffect(() => {
    // Get base path from current location
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/') || ''
    
    // Update service worker registration with base path
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swPath = `${basePath}/sw.js`
        
        // Unregister old service workers first to prevent conflicts
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            if (registration.scope !== `${window.location.origin}${basePath}/`) {
              registration.unregister()
            }
          })
        })
        
        // Register new service worker
        navigator.serviceWorker
          .register(swPath, {
            scope: `${basePath}/`,
            updateViaCache: 'none', // Always check for updates
          })
          .then((registration) => {
            console.log('SW registered:', registration.scope)
            
            // Check for updates every 5 minutes
            setInterval(() => {
              registration.update()
            }, 5 * 60 * 1000)
            
            // Force update on page visibility change
            document.addEventListener('visibilitychange', () => {
              if (!document.hidden) {
                registration.update()
              }
            })
          })
          .catch((error) => {
            console.log('SW registration failed:', error)
          })
      })
    }
  }, [])

  return null
}

