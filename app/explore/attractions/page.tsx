"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin } from "lucide-react"
import { getAllAttractions } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import type { Attraction } from "@/lib/types/database"

export default function AttractionsPage() {
  const [allAttractions, setAllAttractions] = useState<(Attraction & { property_name?: string; property_slug?: string; property_location?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const attractions = await getAllAttractions()
        setAllAttractions(attractions)
      } catch (error) {
        console.error("Error fetching attractions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAttractions()
  }, [])

  // Remove duplicates based on name (in case same attraction appears for multiple properties)
  const uniqueAttractions = Array.from(
    new Map(allAttractions.map((attr) => [attr.name, attr])).values()
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="explore" />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading attractions...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nearby Attractions</h1>
          <p className="text-muted-foreground">Discover the best places to visit near our properties</p>
        </div>

        {allAttractions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attractions available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allAttractions.map((attraction, idx) => (
              <Card key={`${attraction.property_slug}-${attraction.name}-${idx}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mountain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{attraction.name}</CardTitle>
                        {attraction.distance && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{attraction.distance} away</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {attraction.property_name && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Near {attraction.property_name}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{attraction.description || "No description available."}</p>
                  {attraction.property_slug && (
                    <Link 
                      href={`/property/${attraction.property_slug}/attractions`}
                      className="text-sm text-primary hover:underline"
                    >
                      View property →
                    </Link>
                  )}
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
