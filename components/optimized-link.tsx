"use client"

import { useRouter } from "next/navigation"
import { ReactNode, MouseEvent, useTransition, useMemo } from "react"

/**
 * ROOT FIX: OptimizedLink for Static Export
 * 
 * Uses regular anchor tags instead of Next.js Link to avoid RSC prefetching.
 * Next.js Link with prefetch tries to fetch RSC data that doesn't exist in static export.
 * This component provides the same functionality without RSC dependencies.
 */
interface OptimizedLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function OptimizedLink({
  href,
  children,
  className,
  target,
  rel,
  onClick,
}: OptimizedLinkProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Normalize href with trailing slash for static export
  // DO NOT add base path - Next.js basePath config handles it automatically for router.push
  const normalizedHref = useMemo(() => {
    // Don't modify external URLs
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#")) {
      return href
    }
    
    // Add trailing slash for static export (except for hash links)
    let finalHref = href
    if (!finalHref.includes("#") && !finalHref.endsWith("/")) {
      finalHref += "/"
    }
    
    return finalHref
  }, [href])

  // Get base path ONLY for href attribute (not for router.push)
  // Next.js router.push() automatically handles basePath, but href needs it manually
  const hrefWithBasePath = useMemo(() => {
    if (typeof window === "undefined") return normalizedHref
    
    // Don't modify external URLs
    if (normalizedHref.startsWith("http://") || normalizedHref.startsWith("https://") || normalizedHref.startsWith("mailto:") || normalizedHref.startsWith("#")) {
      return normalizedHref
    }
    
    // Get base path from current location
    const pathname = window.location.pathname
    const pathParts = pathname.split('/').filter(Boolean)
    
    // Known routes that indicate we're NOT on GitHub Pages
    const knownRoutes = [
      'explore', 'admin', 'property', 'bookings', 'calendar', 
      'ota-sync', 'rooms', 'finance', 'staff', 'reports', 
      'settings', 'properties', 'checkout', 'confirmation'
    ]
    
    // If first path segment is a known route, we're in dev mode (no base path)
    if (pathParts.length > 0 && knownRoutes.includes(pathParts[0])) {
      return normalizedHref
    }
    
    // Otherwise, first segment is likely the base path (GitHub Pages)
    // Only add if href doesn't already start with it
    if (pathParts.length > 0 && !normalizedHref.startsWith(`/${pathParts[0]}`)) {
      return `/${pathParts[0]}${normalizedHref}`
    }
    
    return normalizedHref
  }, [normalizedHref])

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If target is _blank, let browser handle it (but with correct href)
    if (target === "_blank") {
      if (onClick) onClick(e)
      return
    }

    // Prevent default navigation
    e.preventDefault()
    
    // Use transition for smooth navigation
    // router.push() automatically handles basePath, so use normalizedHref (without manual base path)
    startTransition(() => {
      router.push(normalizedHref)
    })

    if (onClick) onClick(e)
  }

  // ROOT FIX: Use regular anchor tag instead of Next.js Link
  // This prevents Next.js from trying to fetch RSC data
  return (
    <a
      href={hrefWithBasePath} // Use hrefWithBasePath for the actual href attribute
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {children}
    </a>
  )
}

