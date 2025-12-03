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

  // Get base path for GitHub Pages (works for both dev and production)
  const basePath = useMemo(() => {
    if (typeof window === "undefined") return ""
    // Extract base path from current location (e.g., "/114_PropertyManage-Hub")
    // Use the same logic as GitHubPagesScript
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/') || ''
    // Only use base path if it's not empty and not just "/"
    if (basePath && basePath !== '/') {
      return basePath
    }
    return ""
  }, [])

  // Normalize href with base path and trailing slash for static export
  const normalizedHref = useMemo(() => {
    // Don't modify external URLs
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#")) {
      return href
    }
    
    // Add base path if needed
    let finalHref = basePath ? `${basePath}${href}` : href
    
    // Add trailing slash for static export (except for hash links)
    if (!finalHref.includes("#") && !finalHref.endsWith("/")) {
      finalHref += "/"
    }
    
    return finalHref
  }, [href, basePath])

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If target is _blank, let browser handle it (but with correct href)
    if (target === "_blank") {
      if (onClick) onClick(e)
      return
    }

    // Prevent default navigation
    e.preventDefault()
    
    // Use transition for smooth navigation
    startTransition(() => {
      router.push(normalizedHref)
    })

    if (onClick) onClick(e)
  }

  return (
    <a
      href={normalizedHref}
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

