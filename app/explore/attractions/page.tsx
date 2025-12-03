"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

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
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

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
