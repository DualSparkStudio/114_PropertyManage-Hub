"use client"

import { useEffect, useRef, useState } from "react"

// Dynamic import for framer-motion to handle missing package gracefully
let motion: any
let useInView: any

try {
  const fm = require("framer-motion")
  motion = fm.motion
  useInView = fm.useInView
} catch {
  // Fallback if framer-motion is not installed
  motion = { div: ({ children, ...props }: any) => <div {...props}>{children}</div> }
  useInView = () => [null, false]
}

interface TextRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function TextReveal({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  direction = "up",
}: TextRevealProps) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  const directions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
  }

  const MotionDiv = motion.div

  return (
    <MotionDiv
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : directions[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}

// Character-by-character reveal
export function CharReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  const MotionSpan = motion.span

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <MotionSpan
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </MotionSpan>
      ))}
    </span>
  )
}
