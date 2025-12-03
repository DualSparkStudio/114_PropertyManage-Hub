"use client"

// Dynamic import for framer-motion
let motion: any
try {
  motion = require("framer-motion").motion
} catch {
  motion = { button: ({ children, ...props }: any) => <button {...props}>{children}</button> }
}

import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PremiumButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "default" | "ghost" | "glass" | "gradient" | "minimal"
  magnetic?: boolean
}

export function PremiumButton({
  children,
  className,
  variant = "default",
  magnetic = true,
  ...props
}: PremiumButtonProps) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "bg-transparent hover:bg-accent",
    glass: "backdrop-blur-xl bg-white/20 border-white/20 hover:bg-white/30",
    gradient: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
    minimal: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
  }

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden",
        variants[variant],
        className
      )}
      whileHover={magnetic ? { scale: 1.05, y: -2 } : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      <motion.span
        className="relative z-10"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 1 }}
      >
        {children}
      </motion.span>
      {variant === "gradient" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )
}

