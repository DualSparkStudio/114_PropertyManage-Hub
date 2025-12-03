"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"

export default function FeaturesPage() {
  // Aggregate all features from all properties
  const allFeatures = Object.values(propertyData).flatMap((property: any) => {
    if (!property.features) return []
    return property.features.map((feature: any) => ({
      ...feature,
      propertyName: property.name,
      propertySlug: property.slug,
    }))
  })

  // Remove duplicates based on name and icon
  const uniqueFeatures = Array.from(
    new Map(allFeatures.map((feat) => [`${feat.name}-${feat.icon}`, feat])).values()
  )

  // Count how many properties have each feature
  const featureCounts = allFeatures.reduce((acc: Record<string, number>, feature: any) => {
    const key = `${feature.name}-${feature.icon}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background">
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
                <Link href="/explore/attractions" className="py-2 text-muted-foreground hover:text-foreground">
                  Attractions
                </Link>
                <Link href="/explore/features" className="py-2 border-b-2 border-primary text-primary font-medium">
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
          <h1 className="text-4xl font-bold mb-2">Property Features</h1>
          <p className="text-muted-foreground">Everything you need for a perfect stay across all our properties</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {uniqueFeatures.map((feature, idx) => {
            const key = `${feature.name}-${feature.icon}`
            const count = featureCounts[key] || 1
            return (
              <Card key={`${feature.propertySlug}-${key}-${idx}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
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
      </div>

      <Footer />
    </div>
  )
}
