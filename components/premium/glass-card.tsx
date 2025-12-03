"use client"

// Dynamic import for framer-motion
let motion: any
try {
  motion = require("framer-motion").motion
} catch {
  motion = { div: ({ children, ...props }: any) => <div {...props}>{children}</div> }
}

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "backdrop-blur-xl bg-white/70 border-white/20 shadow-lg",
          "hover:bg-white/80 transition-all duration-300",
          className
        )}
      >
        {children}
      </Card>
    </motion.div>
  )
}

