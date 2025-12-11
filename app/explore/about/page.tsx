"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { getAllProperties, getPropertyAbout, getPropertyImages } from "@/lib/supabase/properties"
import type { PropertyAbout } from "@/lib/types/database"

interface PropertyAboutWithName extends PropertyAbout {
  property_name: string
  property_image: string | null
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<PropertyAboutWithName[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const properties = await getAllProperties()
        const aboutPromises = properties.map(async (property) => {
          try {
            const about = await getPropertyAbout(property.id)
            if (!about) return null
            const images = await getPropertyImages(property.id)
            return { 
              ...about, 
              property_name: property.name,
              property_image: images[0]?.url ?? null
            } as PropertyAboutWithName
          } catch (error) {
            // Silently handle 406 errors (RLS policy issues)
            console.warn(`Could not fetch about for property ${property.id}:`, error)
            return null
          }
        })
        const aboutResults = await Promise.all(aboutPromises)
        const validAbout = aboutResults.filter((a): a is PropertyAboutWithName => a !== null)
        setAboutData(validAbout)
      } catch (error) {
        console.error("Error fetching about data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="explore" />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/explore" },
              { label: "About" },
            ]}
          />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-muted-foreground">Learn more about PropertyManage Hub</p>
        </div>

        {aboutData.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No about information available at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {aboutData.map((about, idx) => (
              <Card key={`${about.property_id}-${idx}`} className="overflow-hidden">
                {about.property_image && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={about.property_image}
                      alt={about.property_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{about.property_name || "About"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {about.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{about.description}</p>
                    </div>
                  )}
                  {about.history && (
                    <div>
                      <h3 className="font-semibold mb-2">Our Story</h3>
                      <p className="text-muted-foreground">{about.history}</p>
                    </div>
                  )}
                  {about.awards && about.awards.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Awards & Recognition</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {about.awards.map((award, awardIdx) => (
                          <li key={awardIdx}>{award}</li>
                        ))}
                      </ul>
                    </div>
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


