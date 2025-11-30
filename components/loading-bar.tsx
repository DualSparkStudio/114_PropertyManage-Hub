"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname } from "next/navigation"

export function LoadingBar() {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isPending) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + 10
        })
      }, 50)
      return () => clearInterval(interval)
    } else {
      setProgress(100)
      setTimeout(() => setProgress(0), 300)
    }
  }, [isPending])

  // Track navigation events
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="/"]')
      if (link && !link.getAttribute('target')) {
        startTransition(() => {
          // Navigation will happen
        })
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Reset on pathname change
  useEffect(() => {
    setProgress(0)
  }, [pathname])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-primary/10">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
