"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPropertyById, getPropertyFeatures } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import type { Property, Feature } from "@/lib/types/database"

interface PropertyFeaturesClientProps {
  propertyId: string
}

export function PropertyFeaturesClient({ propertyId }: PropertyFeaturesClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getPropertyById(propertyId)
        if (prop) {
          setProperty(prop)
          const feats = await getPropertyFeatures(prop.id)
          setFeatures(feats)
        }
      } catch (error) {
        console.error("Error fetching property features:", error)
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
            <p className="text-muted-foreground">Loading features...</p>
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
        {property && (
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/explore" },
                { label: property.name, href: `/property/${propertyId}` },
                { label: "Features" },
              ]}
            />
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Property Features - {property.name}</h1>
          <p className="text-muted-foreground">Everything you need for a perfect stay</p>
        </div>

        {features.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No features listed for this property.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.id} className="overflow-hidden">
                <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5">
                  {feature.icon ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl">{feature.icon}</div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl text-primary/30">✨</div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description || "No description available."}</p>
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

