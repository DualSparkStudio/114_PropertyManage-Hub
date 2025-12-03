"use client"

import { ReactNode, MouseEvent, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

/**
 * Static Export Compatible Link Component
 * 
 * ROOT FIX: This component doesn't use Next.js Link's prefetching
 * which tries to fetch RSC data that doesn't exist in static export.
 * Instead, it uses regular anchor tags with client-side navigation.
 */
interface StaticLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function StaticLink({
  href,
  children,
  className,
  target,
  rel,
  onClick,
}: StaticLinkProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Normalize href with trailing slash for static export
  // DO NOT add base path - Next.js basePath config handles it automatically
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
    // router.push() automatically handles basePath, so use normalizedHref (without base path)
    startTransition(() => {
      router.push(normalizedHref)
    })

    if (onClick) onClick(e)
  }

  return (
    <a
      href={hrefWithBasePath}
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

