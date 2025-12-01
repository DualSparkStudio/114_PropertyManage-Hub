"use client"

import { useEffect } from "react"

export function PrefetchHead() {
  useEffect(() => {
    // Get base path from current location (works for both dev and GitHub Pages)
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/') || ''
    
    // Add prefetch links
    const prefetchUrls = [
      '/explore/',
      '/explore/rooms/',
      '/explore/attractions/',
      '/explore/features/',
      '/explore/about/',
      '/explore/contact/',
      '/admin/',
    ]
    
    prefetchUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `${basePath}${url}`
      link.as = 'document'
      document.head.appendChild(link)
    })
    
    // Add prefetch script
    const script = document.createElement('script')
    script.src = `${basePath}/prefetch.js`
    script.defer = true
    document.head.appendChild(script)
    
    return () => {
      // Cleanup on unmount (though this component shouldn't unmount)
      prefetchUrls.forEach(url => {
        const existingLink = document.querySelector(`link[href="${basePath}${url}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
      const existingScript = document.querySelector(`script[src="${basePath}/prefetch.js"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])
  
  return null
}

