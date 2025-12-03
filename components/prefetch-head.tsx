"use client"

import { useEffect } from "react"

export function PrefetchHead() {
  useEffect(() => {
    // Get base path from current location (works for both dev and GitHub Pages)
    // Check if we're on GitHub Pages by looking at the pathname
    const pathname = window.location.pathname
    const pathParts = pathname.split('/').filter(Boolean)
    
    // Known routes that indicate we're NOT on GitHub Pages
    const knownRoutes = [
      'explore', 'admin', 'property', 'bookings', 'calendar', 
      'ota-sync', 'rooms', 'finance', 'staff', 'reports', 
      'settings', 'properties', 'checkout', 'confirmation'
    ]
    
    // Determine base path - only add if first segment is NOT a known route
    let basePath = ''
    if (pathParts.length > 0 && !knownRoutes.includes(pathParts[0])) {
      basePath = `/${pathParts[0]}`
    }
    
    // Add prefetch links (only actual routes, not non-existent admin sub-routes)
    const prefetchUrls = [
      '/explore/',
      '/explore/rooms/',
      '/explore/attractions/',
      '/explore/features/',
      '/explore/about/',
      '/explore/contact/',
      '/admin/',
      '/bookings/',
      '/calendar/',
      '/ota-sync/',
      '/rooms/',
      '/finance/',
      '/staff/',
      '/reports/',
      '/settings/',
      '/properties/',
    ]
    
    prefetchUrls.forEach(url => {
      // Only add base path if it exists and URL doesn't already have it
      const finalUrl = basePath && !url.startsWith(basePath) ? `${basePath}${url}` : url
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = finalUrl
      link.as = 'document'
      document.head.appendChild(link)
    })
    
    // Add prefetch script
    const prefetchScript = document.createElement('script')
    prefetchScript.src = basePath ? `${basePath}/prefetch.js` : '/prefetch.js'
    prefetchScript.defer = true
    document.head.appendChild(prefetchScript)
    
    return () => {
      // Cleanup on unmount (though this component shouldn't unmount)
      prefetchUrls.forEach(url => {
        const finalUrl = basePath && !url.startsWith(basePath) ? `${basePath}${url}` : url
        const existingLink = document.querySelector(`link[href="${finalUrl}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
      const scriptSrc = basePath ? `${basePath}/prefetch.js` : '/prefetch.js'
      const existingPrefetchScript = document.querySelector(`script[src="${scriptSrc}"]`)
      if (existingPrefetchScript) {
        existingPrefetchScript.remove()
      }
    }
  }, [])
  
  return null
}

