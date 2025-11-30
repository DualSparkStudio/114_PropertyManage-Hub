"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Calendar, Home, Bed, Mountain, Sparkles, Info } from "lucide-react"
import { propertyData } from "../property-data"

interface PropertyContactClientProps {
  propertySlug: string
}

export function PropertyContactClient({ propertySlug }: PropertyContactClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <nav className="flex items-center gap-6">
              <Link href={`/property/${propertySlug}`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link href={`/property/${propertySlug}/rooms`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Bed className="h-4 w-4" />
                <span className="hidden sm:inline">Rooms</span>
              </Link>
              <Link href={`/property/${propertySlug}/attractions`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Mountain className="h-4 w-4" />
                <span className="hidden sm:inline">Attractions</span>
              </Link>
              <Link href={`/property/${propertySlug}/features`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </Link>
              <Link href={`/property/${propertySlug}/about`} className="flex items-center gap-2 py-2 px-3 text-muted-foreground hover:text-foreground">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Link>
              <Link href={`/property/${propertySlug}/contact`} className="flex items-center gap-2 py-2 px-3 border-b-2 border-primary text-primary font-medium">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </Link>
              <span className="hidden md:block text-muted-foreground">|</span>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
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

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{property.contact?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{property.contact?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{property.contact?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hours</p>
                  <p className="font-medium">{property.contact?.hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

