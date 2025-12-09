"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Users, Wifi, Car, Star, Home, Mountain, Sparkles, Info, Phone, Share2 } from "lucide-react"
import { getPropertyBySlug, getPropertyImages } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getSlugFromUrl } from "@/lib/utils/get-slug-from-url"
import type { Property } from "@/lib/types/database"

interface PropertyHomeClientProps {
  propertySlug: string
}

export function PropertyHomeClient({ propertySlug }: PropertyHomeClientProps) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    async function fetchProperty() {
      try {
        // If propertySlug is empty, get it from the URL
        // This handles cases where the slug changed and the static page doesn't exist
        let slug = propertySlug || getSlugFromUrl()
        
        if (slug) {
          const prop = await getPropertyBySlug(slug)
          if (prop) {
            setProperty(prop)
            const propertyImages = await getPropertyImages(prop.id)
            setImages(propertyImages.map(img => img.url))
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertySlug])

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }
    router.push(`/checkout?property=${propertySlug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  const handleShare = async () => {
    if (!property) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.name,
          text: `Check out ${property.name} - ${property.location}`,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const totalPrice = property ? nights * Number(property.price) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertySlug={propertySlug} />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading property...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertySlug={propertySlug} />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
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
      <Navbar variant="property" propertySlug={propertySlug} />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Name & Rating */}
            <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{property.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating || 0}</span>
                    <span className="text-muted-foreground">({property.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={handleShare} title="Share this property">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                  <Image
                    src={images[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {images.slice(1, 3).map((img: string, idx: number) => (
                      <div key={idx} className="relative h-32 md:h-48 rounded-xl overflow-hidden">
                        <Image src={img} alt={`${property.name} ${idx + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Home Content */}
            <Card>
              <CardHeader>
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{property.description || "No description available."}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{property.total_rooms || 0} Rooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Up to {guests} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Free Wi-Fi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Parking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold">₹{property.price}</span>
                    <span className="text-muted-foreground">/night</span>
                  </div>
                  <Badge variant="secondary">{property.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Check-in</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout">Check-out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>
                {nights > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>₹{property.price} x {nights} nights</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>₹{Math.round(totalPrice * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{totalPrice + Math.round(totalPrice * 0.1)}</span>
                    </div>
                  </div>
                )}
                <Button className="w-full" size="lg" onClick={handleBookNow}>
                  Book Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You won&apos;t be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

