"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Users, Square } from "lucide-react"
import { getPropertyById, getPropertyRoomTypes, getRoomTypeImages } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { convertGoogleDriveUrl } from "@/lib/utils/convert-google-drive-url"
import type { Property, RoomType } from "@/lib/types/database"

interface PropertyRoomsClientProps {
  propertyId: string
}

export function PropertyRoomsClient({ propertyId }: PropertyRoomsClientProps) {
  const pathname = usePathname()
  const [property, setProperty] = useState<Property | null>(null)
  const [roomTypes, setRoomTypes] = useState<(RoomType & { image_urls?: string[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get property ID from prop or extract from URL path
        let id = propertyId
        if (!id && typeof window !== 'undefined') {
          const pathParts = pathname.split('/').filter(Boolean)
          const propertyIndex = pathParts.indexOf('property')
          if (propertyIndex !== -1 && pathParts[propertyIndex + 1]) {
            id = pathParts[propertyIndex + 1]
          }
        }
        
        if (!id) {
          console.error("No property ID found")
          setLoading(false)
          return
        }
        
        const prop = await getPropertyById(id)
        if (prop) {
          setProperty(prop)
          const rooms = await getPropertyRoomTypes(prop.id)
          // Fetch images for each room type
          const roomsWithImages = await Promise.all(
            rooms.map(async (rt) => {
              try {
                const roomImages = await getRoomTypeImages(rt.id)
                return {
                  ...rt,
                  image_urls: roomImages.map(img => convertGoogleDriveUrl(img.url)),
                }
              } catch {
                return {
                  ...rt,
                  image_urls: rt.image_url ? [convertGoogleDriveUrl(rt.image_url)] : [],
                }
              }
            })
          )
          setRoomTypes(roomsWithImages)
        }
      } catch (error) {
        console.error("Error fetching property rooms:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [propertyId, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
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
                { label: "Rooms" },
              ]}
            />
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Rooms - {property.name}</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious accommodations</p>
        </div>

        {roomTypes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {roomTypes.map((room) => {
              const roomImage = room.image_urls && room.image_urls.length > 0 
                ? convertGoogleDriveUrl(room.image_urls[0])
                : room.image_url ? convertGoogleDriveUrl(room.image_url) : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
              
              return (
                <Card key={room.id}>
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="relative h-64 md:h-48 md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={roomImage}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-4">{room.name}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          <span>{room.beds}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          <span>{room.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Up to {room.max_guests} guests</span>
                        </div>
                        {room.description && (
                          <p className="text-sm mt-2">{room.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-3xl font-bold">₹{room.price}</span>
                          <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                        <Button asChild>
                          <Link href={`/checkout?property=${propertyId}&roomType=${room.id}&roomName=${encodeURIComponent(room.name)}&roomPrice=${room.price}`}>
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
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

