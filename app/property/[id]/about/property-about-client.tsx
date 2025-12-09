"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPropertyById, getPropertyAbout } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import type { Property, PropertyAbout } from "@/lib/types/database"

interface PropertyAboutClientProps {
  propertyId: string
}

export function PropertyAboutClient({ propertyId }: PropertyAboutClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [about, setAbout] = useState<PropertyAbout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getPropertyById(propertyId)
        if (prop) {
          setProperty(prop)
          const aboutData = await getPropertyAbout(prop.id)
          setAbout(aboutData)
        }
      } catch (error) {
        console.error("Error fetching property about:", error)
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
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
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
        <div className="container mx-auto px-6 py-12 max-w-4xl">
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

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">About {property.name}</h1>
          <p className="text-muted-foreground">Learn more about our property</p>
        </div>

        <div className="space-y-6">
          {about?.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{about.description}</p>
              </CardContent>
            </Card>
          )}

          {about?.history && (
            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{about.history}</p>
              </CardContent>
            </Card>
          )}

          {about?.awards && about.awards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {about.awards.map((award: string, idx: number) => (
                    <li key={idx}>{award}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {!about && (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">No additional information available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

