"use client"

import { useEffect } from "react"

export function PrefetchHead() {
  useEffect(() => {
    // Get base path from current location (works for both dev and GitHub Pages)
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/') || ''
    
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
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `${basePath}${url}`
      link.as = 'document'
      document.head.appendChild(link)
    })
    
    // Add scripts
    const suppressScript = document.createElement('script')
    suppressScript.src = `${basePath}/suppress-rsc-errors.js`
    suppressScript.defer = true
    document.head.appendChild(suppressScript)
    
    const prefetchScript = document.createElement('script')
    prefetchScript.src = `${basePath}/prefetch.js`
    prefetchScript.defer = true
    document.head.appendChild(prefetchScript)
    
    return () => {
      // Cleanup on unmount (though this component shouldn't unmount)
      prefetchUrls.forEach(url => {
        const existingLink = document.querySelector(`link[href="${basePath}${url}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
      const existingPrefetchScript = document.querySelector(`script[src="${basePath}/prefetch.js"]`)
      if (existingPrefetchScript) {
        existingPrefetchScript.remove()
      }
      const existingSuppressScript = document.querySelector(`script[src="${basePath}/suppress-rsc-errors.js"]`)
      if (existingSuppressScript) {
        existingSuppressScript.remove()
      }
    }
  }, [])
  
  return null
}

