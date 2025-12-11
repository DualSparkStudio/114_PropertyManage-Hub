"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Calendar } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { getAllProperties, getPropertyContact } from "@/lib/supabase/properties"
import { supabase } from "@/lib/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Property } from "@/lib/types/database"

// Google Maps embed component
function MapEmbed({ address, embedUrl }: { address?: string; embedUrl?: string | null }) {
  // If embed URL is provided, use it directly
  if (embedUrl) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          onError={() => {
            console.warn("Map embed failed")
          }}
        />
      </div>
    )
  }
  
  // Otherwise, use address to generate embed
  if (!address) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No map available</p>
      </div>
    )
  }
  
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    property_id: "none",
  })
  const [properties, setProperties] = useState<Property[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchProperties() {
      try {
        const propertiesData = await getAllProperties()
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching properties:", error)
      }
    }
    fetchProperties()
  }, [])

  // PropertyManage contact information (from footer)
  const propertyManageContact = {
    address: "123 Property Street, Suite 100\nNew York, NY 10001, USA",
    phone: "+1 (234) 567-8900",
    email: "info@propertymanage.com",
    website: "www.propertymanage.com",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          property_id: formData.property_id && formData.property_id !== "none" ? formData.property_id : null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        })

      if (error) {
        console.error("Error submitting message:", error)
        alert("Failed to send message. Please try again.")
      } else {
        alert("Thank you for your message! We'll get back to you soon.")
        setFormData({ name: "", email: "", phone: "", message: "", property_id: "none" })
      }
    } catch (error) {
      console.error("Error submitting message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/explore" },
              { label: "Contact" },
            ]}
          />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
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
                  <Label htmlFor="property">Property (Optional)</Label>
                  <Select value={formData.property_id} onValueChange={(value) => setFormData({ ...formData, property_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${propertyManageContact.phone.replace(/\s/g, '')}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {propertyManageContact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${propertyManageContact.email}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {propertyManageContact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium whitespace-pre-line">{propertyManageContact.address}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Location</p>
                  <MapEmbed address={propertyManageContact.address} embedUrl={null} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


