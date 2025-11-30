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
  useEffect(() => {
    const link = linkRef.current
    if (!link || target === "_blank") return

    let timeoutId: NodeJS.Timeout

    const handleMouseEnter = () => {
      // Delay prefetch slightly to avoid prefetching on accidental hovers
      timeoutId = setTimeout(() => {
        router.prefetch(href)
      }, 100)
    }

    const handleMouseLeave = () => {
      clearTimeout(timeoutId)
    }

    link.addEventListener("mouseenter", handleMouseEnter)
    link.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter)
      link.removeEventListener("mouseleave", handleMouseLeave)
      clearTimeout(timeoutId)
    }
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
      prefetch={true}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {children}
    </Link>
  )
}

