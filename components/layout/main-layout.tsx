"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { AdminFooter } from "./admin-footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main 
          className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6"
          style={{ 
            WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
            overscrollBehavior: 'contain' // Prevent scroll chaining
          }}
          data-lenis-prevent // Prevent Lenis from controlling this scroll container
        >
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  )
}

