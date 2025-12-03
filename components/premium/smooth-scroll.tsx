"use client"

import { useEffect } from "react"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return

    let lenis: any

    // Try to initialize Lenis
    try {
      const Lenis = require("lenis")
      lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
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
  }, [])

  return <>{children}</>
}

