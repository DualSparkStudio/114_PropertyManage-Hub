"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Users, Wifi, Car, Star, Home, Mountain, Sparkles, Info, Phone, Share2 } from "lucide-react"
import { getPropertyById, getPropertyImages, getPropertyRoomTypes } from "@/lib/data/mock-data-helpers"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import type { Property, RoomType } from "@/lib/types/database"

interface PropertyHomeClientProps {
  propertyId: string
}

export function PropertyHomeClient({ propertyId }: PropertyHomeClientProps) {
  const pathname = usePathname()
  const [property, setProperty] = useState<Property | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperty() {
      try {
        // Get property ID from prop or extract from URL path
        let id = propertyId
        
        // If no propertyId provided, extract from URL path
        if (!id && typeof window !== 'undefined') {
          const pathParts = pathname.split('/').filter(Boolean)
          const propertyIndex = pathParts.indexOf('property')
          if (propertyIndex !== -1 && pathParts[propertyIndex + 1]) {
            id = pathParts[propertyIndex + 1]
          }
        }
        
        if (id) {
          console.log('Fetching property with ID:', id)
          const prop = await getPropertyById(id)
          if (prop) {
            setProperty(prop)
            const propertyImages = await getPropertyImages(prop.id)
            const convertedImages = propertyImages.map(img => img.url)
            setImages(convertedImages)
            const rooms = await getPropertyRoomTypes(prop.id)
            setRoomTypes(rooms)
          } else {
            console.error("Property not found with ID:", id)
            setLoading(false)
          }
        } else {
          console.error("No property ID found in URL or props")
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching property:", error)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId, pathname])

  // Calculate total rooms and max guests from room types
  const totalRooms = roomTypes.reduce((sum, rt) => sum + (rt.number_of_rooms || 0), 0)
  const maxGuests = roomTypes.length > 0 
    ? Math.max(...roomTypes.map(rt => rt.max_guests || 0))
    : 0

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


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
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
        <Navbar variant="property" propertyId={propertyId} />
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
      <Navbar variant="property" propertyId={propertyId} />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {property && (
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/explore" },
                { label: property.name },
              ]}
            />
          </div>
        )}
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
              <div className="space-y-4">
                {/* Main Hero Image */}
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load image:', images[0])
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', images[0])
                    }}
                  />
                </div>
                {/* Additional Images Grid */}
                {images.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.slice(1).map((img: string, idx: number) => (
                      <div key={idx} className="relative h-32 md:h-40 rounded-xl overflow-hidden bg-muted">
                        <img 
                          src={img} 
                          alt={`${property.name} ${idx + 2}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load image:', img)
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', img)
                          }}
                        />
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
                      <p className="text-sm font-medium">{totalRooms} Rooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Up to {maxGuests || 0} guests</p>
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

          {/* Quick Actions Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle>Explore Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Browse our available rooms and find the perfect accommodation for your stay.
                </p>
                <Button asChild className="w-full" size="lg">
                  <Link href={`/property/${propertyId}/rooms`}>
                    View All Rooms
                  </Link>
                </Button>
                <div className="pt-4 border-t space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/property/${propertyId}/attractions`}>
                      Nearby Attractions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/property/${propertyId}/features`}>
                      Property Features
                    </Link>
                  </Button>
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

