"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

interface PropertyAboutClientProps {
  propertySlug: string
}

export function PropertyAboutClient({ propertySlug }: PropertyAboutClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertySlug={propertySlug} />

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

