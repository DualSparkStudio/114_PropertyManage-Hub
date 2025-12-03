"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, MapPin, Home, Bed, Sparkles, Info, Phone } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"

interface PropertyAttractionsClientProps {
  propertySlug: string
}

export function PropertyAttractionsClient({ propertySlug }: PropertyAttractionsClientProps) {
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
              <Link href={`/property/${propertySlug}/attractions`} className="flex items-center gap-2 py-2 px-3 border-b-2 border-primary text-primary font-medium">
                <Mountain className="h-4 w-4" />
                <span className="hidden sm:inline">Attractions</span>
              </Link>
              <Link href={`/property/${propertySlug}/features`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </Link>
              <Link href={`/property/${propertySlug}/about`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
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

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nearby Attractions - {property.name}</h1>
          <p className="text-muted-foreground">Discover the best places to visit during your stay</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {property.attractions?.map((attraction: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{attraction.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{attraction.distance} away</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{attraction.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

