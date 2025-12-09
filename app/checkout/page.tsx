"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getPropertyBySlug, getPropertyImages } from "@/lib/supabase/properties"
import { useState, useEffect } from "react"
import type { Property } from "@/lib/types/database"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const propertySlug = searchParams.get("property") || ""
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = Number(searchParams.get("guests")) || 2

  const [property, setProperty] = useState<Property | null>(null)
  const [image, setImage] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperty() {
      if (!propertySlug) {
        setLoading(false)
        return
      }
      try {
        const prop = await getPropertyBySlug(propertySlug)
        if (prop) {
          setProperty(prop)
          const images = await getPropertyImages(prop.id)
          setImage(images[0]?.url || "")
        }
      } catch (error) {
        console.error("Error fetching property:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertySlug])

  const nights = checkIn && checkOut && property
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const subtotal = property ? nights * Number(property.price) : 0
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd send this to your backend
    router.push(`/confirmation?bookingId=${Date.now()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-white">
          <div className="container mx-auto px-6 py-4">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Property not found</p>
            <Link href="/explore" className="text-primary hover:underline mt-4 inline-block">
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <Link href="/explore" className="text-2xl font-bold text-primary">
            PropertyManage
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
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
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requests">Special Requests (Optional)</Label>
                      <Input
                        id="requests"
                        placeholder="Late check-in, extra towels, etc."
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Confirm Booking
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    {image && (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={property.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{checkIn || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{checkOut || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span>{guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights</span>
                      <span>{nights}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>₹{property.price} x {nights} nights</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>₹{serviceFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

