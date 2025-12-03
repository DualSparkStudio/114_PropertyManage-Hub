"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode, MouseEvent, useEffect, useRef, useTransition } from "react"

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
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [isPending, startTransition] = useTransition()

  // Prefetch on hover with delay to avoid unnecessary requests
  // Disabled for static export to prevent RSC data fetching errors
  useEffect(() => {
    const link = linkRef.current
    if (!link || target === "_blank") return

    // Skip prefetching in static export mode (no RSC support)
    // The prefetch.js script handles prefetching instead
    return
  }, [href, router, target])

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If target is _blank, let browser handle it
    if (target === "_blank") {
      if (onClick) onClick(e)
      return
    }

    e.preventDefault()
    
    // Use transition for smooth navigation
    startTransition(() => {
      router.push(href)
    })

    if (onClick) onClick(e)
  }

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      prefetch={false}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {children}
    </Link>
  )
}

