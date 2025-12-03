"use client"

import { useRef } from "react"

// Dynamic import for framer-motion
let motion: any
let useScroll: any
let useTransform: any

try {
  const fm = require("framer-motion")
  motion = fm.motion
  useScroll = fm.useScroll
  useTransform = fm.useTransform
} catch {
  motion = { div: ({ children, ...props }: any) => <div {...props}>{children}</div> }
  useScroll = () => ({ scrollYProgress: { get: () => 0 } })
  useTransform = () => () => 0
}

import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

