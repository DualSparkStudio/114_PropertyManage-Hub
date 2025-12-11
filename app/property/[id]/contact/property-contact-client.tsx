"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Calendar } from "lucide-react"
import { getPropertyById, getPropertyContact } from "@/lib/supabase/properties"
import { supabase } from "@/lib/supabase/client"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import type { Property, PropertyContact } from "@/lib/types/database"

// Google Maps embed component
function MapEmbed({ address }: { address: string }) {
  const encodedAddress = encodeURIComponent(address)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  // If no API key, show a link to Google Maps instead
  if (!apiKey) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View on Google Maps
        </a>
      </div>
    )
  }
  
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
        onError={() => {
          // Fallback if iframe fails
          console.warn("Google Maps embed failed")
        }}
      />
    </div>
  )
}

interface PropertyContactClientProps {
  propertyId: string
}

export function PropertyContactClient({ propertyId }: PropertyContactClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [contact, setContact] = useState<PropertyContact | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const prop = await getPropertyById(propertyId)
        if (prop) {
          setProperty(prop)
          try {
            const contactData = await getPropertyContact(prop.id)
            setContact(contactData)
          } catch (error) {
            // Silently handle 406 errors (RLS policy issues)
            console.warn(`Could not fetch contact for property ${prop.id}:`, error)
            setContact(null)
          }
        }
      } catch (error) {
        console.error("Error fetching property contact:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [propertyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return

    try {
      // Save contact message to database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          property_id: property.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new',
        })

      if (error) throw error

      alert("Thank you for your message! We'll get back to you soon.")
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
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
                { label: "Contact" },
              ]}
            />
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact {property.name}</h1>
          <p className="text-muted-foreground">Get in touch with us for any inquiries</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contact?.phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{contact.phone}</p>
                    </div>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{contact.email}</p>
                    </div>
                  </div>
                )}
                {contact?.address && (
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{contact.address}</p>
                    </div>
                  </div>
                )}
                {contact?.hours && (
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hours</p>
                      <p className="font-medium whitespace-pre-line">{contact.hours}</p>
                    </div>
                  </div>
                )}
                {!contact && (
                  <p className="text-sm text-muted-foreground">Contact information not available.</p>
                )}
              </CardContent>
            </Card>
            
            {contact?.address && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapEmbed address={contact.address} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

