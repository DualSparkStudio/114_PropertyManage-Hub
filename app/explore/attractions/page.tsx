"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"

export default function AttractionsPage() {
  // Aggregate all attractions from all properties
  const allAttractions = Object.values(propertyData).flatMap((property: any) => {
    if (!property.attractions) return []
    return property.attractions.map((attraction: any) => ({
      ...attraction,
      propertyName: property.name,
      propertySlug: property.slug,
      propertyLocation: property.location,
    }))
  })

  // Remove duplicates based on name (in case same attraction appears for multiple properties)
  const uniqueAttractions = Array.from(
    new Map(allAttractions.map((attr) => [attr.name, attr])).values()
  )

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="py-2 text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link href="/explore/rooms" className="py-2 text-muted-foreground hover:text-foreground">
                  Rooms
                </Link>
                <Link href="/explore/attractions" className="py-2 border-b-2 border-primary text-primary font-medium">
                  Attractions
                </Link>
                <Link href="/explore/features" className="py-2 text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/explore/about" className="py-2 text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="/explore/contact" className="py-2 text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
              <span className="hidden md:block text-muted-foreground">|</span>
              <nav className="flex items-center gap-6">
                <Link href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nearby Attractions</h1>
          <p className="text-muted-foreground">Discover the best places to visit near our properties</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allAttractions.map((attraction, idx) => (
            <Card key={`${attraction.propertySlug}-${attraction.name}-${idx}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mountain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{attraction.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{attraction.distance} away</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Near {attraction.propertyName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{attraction.description}</p>
                <Link 
                  href={`/property/${attraction.propertySlug}/attractions`}
                  className="text-sm text-primary hover:underline"
                >
                  View property →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
