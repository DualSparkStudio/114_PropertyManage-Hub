"use client"

// Dynamic import for framer-motion
let motion: any
try {
  motion = require("framer-motion").motion
} catch {
  motion = { div: ({ children, ...props }: any) => <div {...props}>{children}</div> }
}

export function GradientNoise() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export function BlurredBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute top-0 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 0%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 0%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 0%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 0%), radial-gradient(at 97% 96%, hsla(38, 60%, 65%, 1) 0px, transparent 0%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 0%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 0%)",
        }}
      />
    </div>
  )
}

