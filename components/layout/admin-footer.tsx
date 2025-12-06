"use client"

import { 
  Home, 
  Building2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Globe
} from "lucide-react"
import { OptimizedLink } from "@/components/optimized-link"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                PropertyManage
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Modern property management system for hotels and resorts. 
              Streamline your operations and enhance guest experiences.
            </p>
            <div className="flex items-center gap-4">
              <span
                className="text-muted-foreground hover:text-primary transition-colors cursor-default"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <span
                className="text-muted-foreground hover:text-primary transition-colors cursor-default"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <OptimizedLink
                  href="/explore"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Explore Properties
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/explore/rooms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Rooms
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/explore/attractions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Attractions
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/explore/features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/explore/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/explore/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </OptimizedLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              <li>
                <OptimizedLink
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Property Management
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/bookings"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Booking Management
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/calendar"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Calendar View
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/ota-sync"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  OTA Integration
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/finance"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Financial Reports
                </OptimizedLink>
              </li>
              <li>
                <OptimizedLink
                  href="/reports"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Analytics & Reports
                </OptimizedLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Property Street, Suite 100<br />
                  New York, NY 10001, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:info@propertymanage.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@propertymanage.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="https://propertymanage.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  www.propertymanage.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} PropertyManage Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <OptimizedLink
                href="/explore/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </OptimizedLink>
              <OptimizedLink
                href="/explore/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </OptimizedLink>
              <OptimizedLink
                href="/explore/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Support
              </OptimizedLink>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Design & developed by{" "}
              <a
                href="https://dualsparkstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium transition-colors"
              >
                DualSpark Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

