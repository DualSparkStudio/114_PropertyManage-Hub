"use client"

import { ReactNode, MouseEvent } from "react"
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

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If target is _blank, let browser handle it
    if (target === "_blank") {
      if (onClick) onClick(e)
      return
    }

    // Prevent default navigation
    e.preventDefault()
    
    // Use transition for smooth navigation
    startTransition(() => {
      router.push(href)
    })

    if (onClick) onClick(e)
  }

  return (
    <a
      href={href}
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

