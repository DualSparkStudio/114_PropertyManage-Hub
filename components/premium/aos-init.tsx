"use client"

import { useEffect } from "react"

export function AOSInit() {
  useEffect(() => {
    if (typeof window === "undefined") return

    let AOS: any
    try {
      AOS = require("aos")
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        offset: 100,
      })
    } catch (error) {
      // AOS not installed, skip
    }

    return () => {
      if (AOS) {
        AOS.refresh()
      }
    }
  }, [])

  return null
}

