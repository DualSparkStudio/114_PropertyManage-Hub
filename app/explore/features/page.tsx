"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllFeatures } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import type { Feature } from "@/lib/types/database"

export default function FeaturesPage() {
  const [allFeatures, setAllFeatures] = useState<(Feature & { property_name?: string; property_slug?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const features = await getAllFeatures()
        setAllFeatures(features)
      } catch (error) {
        console.error("Error fetching features:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatures()
  }, [])

  // Remove duplicates based on name and icon
  const uniqueFeatures = Array.from(
    new Map(allFeatures.map((feat) => [`${feat.name}-${feat.icon}`, feat])).values()
  )

  // Count how many properties have each feature
  const featureCounts = allFeatures.reduce((acc: Record<string, number>, feature) => {
    const key = `${feature.name}-${feature.icon}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="explore" />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading features...</p>
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
          <h1 className="text-4xl font-bold mb-2">Property Features</h1>
          <p className="text-muted-foreground">Everything you need for a perfect stay across all our properties</p>
        </div>

        {uniqueFeatures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No features available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {uniqueFeatures.map((feature, idx) => {
              const key = `${feature.name}-${feature.icon}`
              const count = featureCounts[key] || 1
              return (
                <Card key={`${feature.property_slug}-${key}-${idx}`}>
                  <CardContent className="p-6 text-center">
                    {feature.icon && <div className="text-5xl mb-4">{feature.icon}</div>}
                    <h3 className="font-semibold mb-2">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description || "No description available."}</p>
                    {count > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        Available at {count} properties
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
