"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, MapPin } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

interface PropertyAttractionsClientProps {
  propertySlug: string
}

export function PropertyAttractionsClient({ propertySlug }: PropertyAttractionsClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertySlug={propertySlug} />

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

