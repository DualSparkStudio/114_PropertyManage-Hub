"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getAllProperties, getPropertyAbout } from "@/lib/supabase/properties"
import type { PropertyAbout } from "@/lib/types/database"

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<PropertyAbout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const properties = await getAllProperties()
        const aboutPromises = properties.map(async (property) => {
          const about = await getPropertyAbout(property.id)
          return about ? { ...about, property_name: property.name } : null
        })
        const aboutResults = await Promise.all(aboutPromises)
        const validAbout = aboutResults.filter((a): a is PropertyAbout & { property_name: string } => a !== null)
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
              <Card key={`${about.property_id}-${idx}`}>
                <CardHeader>
                  <CardTitle>{about.property_name || "About"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {about.history && (
                    <div>
                      <h3 className="font-semibold mb-2">Our Story</h3>
                      <p className="text-muted-foreground">{about.history}</p>
                    </div>
                  )}
                  {about.mission && (
                    <div>
                      <h3 className="font-semibold mb-2">Our Mission</h3>
                      <p className="text-muted-foreground">{about.mission}</p>
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
                  {about.values && about.values.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Our Values</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {about.values.map((value, valueIdx) => (
                          <li key={valueIdx}>{value}</li>
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


