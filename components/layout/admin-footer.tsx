"use client"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} PropertyManage Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/explore/about"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/explore/about"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/explore/contact"
              className="hover:text-primary transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

