"use client"

import { motion } from "framer-motion"

// Hover lift effect
export function HoverLift({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

// Hover scale effect
export function HoverScale({ children, className = "", scale = 1.05 }: { children: React.ReactNode; className?: string; scale?: number }) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

// Hover glow effect
export function HoverGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`${className} transition-shadow duration-300`}
      whileHover={{
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
      }}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect
export function MagneticHover({ children, className = "", strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

// Image hover parallax
export function ImageHoverParallax({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`${className} overflow-hidden`}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Card hover effect with shadow
export function CardHover({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

