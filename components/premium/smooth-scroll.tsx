"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  useEffect(() => {
    if (typeof window === "undefined") return

    // Disable Lenis for admin pages (they have their own scroll containers)
    const isAdminPage = pathname?.startsWith("/admin") || 
                       pathname?.startsWith("/bookings") ||
                       pathname?.startsWith("/calendar") ||
                       pathname?.startsWith("/ota-sync") ||
                       pathname?.startsWith("/rooms") ||
                       pathname?.startsWith("/finance") ||
                       pathname?.startsWith("/staff") ||
                       pathname?.startsWith("/reports") ||
                       pathname?.startsWith("/settings") ||
                       pathname?.startsWith("/properties")

    if (isAdminPage) {
      // For admin pages, use native scrolling
      document.documentElement.style.scrollBehavior = "auto"
      return
    }

    let lenis: any

    // Try to initialize Lenis for public pages only
    try {
      const Lenis = require("lenis")
      lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: true, // Enable smooth touch on mobile for better UX
        touchMultiplier: 1.5, // Reduced for smoother mobile scrolling
        infinite: false,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      // Add lenis class to html
      document.documentElement.classList.add("lenis")
      if (lenis) {
        document.documentElement.classList.add("lenis-smooth")
      }
    } catch (error) {
      // Fallback to CSS smooth scroll if Lenis is not available
      document.documentElement.style.scrollBehavior = "smooth"
    }

    return () => {
      if (lenis) {
        lenis.destroy()
        document.documentElement.classList.remove("lenis", "lenis-smooth")
      } else {
        document.documentElement.style.scrollBehavior = "auto"
      }
    }
  }, [pathname])

  return <>{children}</>
}

