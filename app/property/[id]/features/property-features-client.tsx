"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

interface PropertyFeaturesClientProps {
  propertySlug: string
}

export function PropertyFeaturesClient({ propertySlug }: PropertyFeaturesClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertySlug={propertySlug} />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Property Features - {property.name}</h1>
          <p className="text-muted-foreground">Everything you need for a perfect stay</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {property.features?.map((feature: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

