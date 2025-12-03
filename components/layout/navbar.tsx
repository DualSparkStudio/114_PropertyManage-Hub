"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { OptimizedLink } from "@/components/optimized-link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  variant?: "explore" | "property"
  propertySlug?: string
}

export function Navbar({ variant = "explore", propertySlug }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const exploreNavItems = [
    { href: "/explore", label: "Home" },
    { href: "/explore/rooms", label: "Rooms" },
    { href: "/explore/attractions", label: "Attractions" },
    { href: "/explore/features", label: "Features" },
    { href: "/explore/about", label: "About" },
    { href: "/explore/contact", label: "Contact" },
  ]

  const propertyNavItems = propertySlug
    ? [
        { href: `/property/${propertySlug}`, label: "Home", icon: "Home" },
        { href: `/property/${propertySlug}/rooms`, label: "Rooms", icon: "Bed" },
        { href: `/property/${propertySlug}/attractions`, label: "Attractions", icon: "Mountain" },
        { href: `/property/${propertySlug}/features`, label: "Features", icon: "Sparkles" },
        { href: `/property/${propertySlug}/about`, label: "About", icon: "Info" },
        { href: `/property/${propertySlug}/contact`, label: "Contact", icon: "Phone" },
      ]
    : []

  const navItems = variant === "explore" ? exploreNavItems : propertyNavItems

  const isActive = (href: string) => {
    if (variant === "property") {
      return pathname === href || pathname?.startsWith(href + "/")
    }
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <OptimizedLink 
            href={variant === "explore" ? "/explore" : `/property/${propertySlug}`}
            className="text-xl md:text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            PropertyManage
          </OptimizedLink>
          
          <div className="flex items-center gap-4 md:gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <OptimizedLink
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </OptimizedLink>
              ))}
            </nav>

            <span className="hidden md:block text-muted-foreground">|</span>

            {/* Quick Links */}
            <nav className="hidden sm:flex items-center gap-4 md:gap-6">
              <OptimizedLink 
                href="/explore" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Explore
              </OptimizedLink>
              <OptimizedLink 
                href="/admin" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Admin
              </OptimizedLink>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <OptimizedLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "py-3 px-4 rounded-lg text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </OptimizedLink>
                  ))}
                  <div className="pt-4 mt-4 border-t">
                    <OptimizedLink
                      href="/explore"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Explore
                    </OptimizedLink>
                    <OptimizedLink
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Admin
                    </OptimizedLink>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

