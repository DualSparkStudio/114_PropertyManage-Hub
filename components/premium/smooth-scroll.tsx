"use client"

import { useEffect } from "react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lenis smooth scroll will be initialized here once package is installed
    // For now, using CSS smooth scroll
    if (typeof window !== "undefined") {
      // Add smooth scroll behavior
      document.documentElement.style.scrollBehavior = "smooth"
      
      return () => {
        document.documentElement.style.scrollBehavior = "auto"
      }
    }
  }, [])

  return <>{children}</>
}

