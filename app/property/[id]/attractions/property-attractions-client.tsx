"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, MapPin } from "lucide-react"
import { getPropertyById, getPropertyAttractions } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import type { Property, Attraction } from "@/lib/types/database"

interface PropertyAttractionsClientProps {
  propertyId: string
}

export function PropertyAttractionsClient({ propertyId }: PropertyAttractionsClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getPropertyById(propertyId)
        if (prop) {
          setProperty(prop)
          const attrs = await getPropertyAttractions(prop.id)
          setAttractions(attrs)
        }
      } catch (error) {
        console.error("Error fetching property attractions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [propertyId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading attractions...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Property not found</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertyId={propertyId} />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nearby Attractions - {property.name}</h1>
          <p className="text-muted-foreground">Discover the best places to visit during your stay</p>
        </div>

        {attractions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attractions listed for this property.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {attractions.map((attraction) => (
              <Card key={attraction.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mountain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{attraction.name}</CardTitle>
                      {attraction.distance && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{attraction.distance} away</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{attraction.description || "No description available."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

