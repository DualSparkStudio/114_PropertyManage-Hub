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
        navigator.serviceWorker
          .register(swPath)
          .then(() => console.log('SW registered'))
          .catch(() => console.log('SW registration failed'))
      })
    }
  }, [])

  return null
}

