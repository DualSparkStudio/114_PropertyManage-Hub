"use client"

import { useRef, useState, MouseEvent } from "react"

// Dynamic import for framer-motion
let motion: any
let useMotionValue: any
let useSpring: any
let useTransform: any

try {
  const fm = require("framer-motion")
  motion = fm.motion
  useMotionValue = fm.useMotionValue
  useSpring = fm.useSpring
  useTransform = fm.useTransform
} catch {
  motion = { button: ({ children, ...props }: any) => <button {...props}>{children}</button> }
  useMotionValue = () => ({ get: () => 0, set: () => {} })
  useSpring = (val: any) => val
  useTransform = () => () => 0
}

import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends ButtonProps {
  magnetic?: boolean
  magneticStrength?: number
}

export function MagneticButton({
  children,
  className,
  magnetic = true,
  magneticStrength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || !magnetic) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX * magneticStrength)
    y.set(distanceY * magneticStrength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={ref}
      className={cn(className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

