"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Bed, Mountain, Sparkles, Info, Phone } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"

interface PropertyAboutClientProps {
  propertySlug: string
}

export function PropertyAboutClient({ propertySlug }: PropertyAboutClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <nav className="flex items-center gap-6">
              <Link href={`/property/${propertySlug}`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link href={`/property/${propertySlug}/rooms`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Bed className="h-4 w-4" />
                <span className="hidden sm:inline">Rooms</span>
              </Link>
              <Link href={`/property/${propertySlug}/attractions`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Mountain className="h-4 w-4" />
                <span className="hidden sm:inline">Attractions</span>
              </Link>
              <Link href={`/property/${propertySlug}/features`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </Link>
              <Link href={`/property/${propertySlug}/about`} className="flex items-center gap-2 py-2 px-3 border-b-2 border-primary text-primary font-medium">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Link>
              <Link href={`/property/${propertySlug}/contact`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </Link>
              <span className="hidden md:block text-muted-foreground">|</span>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">About {property.name}</h1>
          <p className="text-muted-foreground">Learn more about our property</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.about?.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.about?.history}</p>
            </CardContent>
          </Card>

          {property.about?.awards && (
            <Card>
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {property.about.awards.map((award: string, idx: number) => (
                    <li key={idx}>{award}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

