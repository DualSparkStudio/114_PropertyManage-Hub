"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bed, Users, Square, MapPin } from "lucide-react"
import { getAllRoomTypes, getRoomTypeImages } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { OptimizedLink } from "@/components/optimized-link"
import type { RoomType } from "@/lib/types/database"

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState<(RoomType & { property_name?: string; property_id?: string; property_location?: string; image_urls?: string[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await getAllRoomTypes()
        // Fetch images for each room type
        const roomsWithImages = await Promise.all(
          rooms.map(async (rt) => {
            try {
              const roomImages = await getRoomTypeImages(rt.id)
              return {
                ...rt,
                image_urls: roomImages.map(img => img.url),
              }
            } catch {
              return {
                ...rt,
                image_urls: rt.image_url ? [rt.image_url] : [],
              }
            }
          })
        )
        setAllRooms(roomsWithImages)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="explore" />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Available Rooms</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious accommodations across all properties</p>
        </div>

        {allRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allRooms.map((room, idx) => {
              const roomImage = room.image_urls && room.image_urls.length > 0 
                ? room.image_urls[0] 
                : room.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
              
              return (
                <Card key={`${room.property_id}-${room.id}-${idx}`} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={roomImage}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                    {room.property_name && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                          {room.property_name}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    {room.property_location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{room.property_location}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{room.beds}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <span>{room.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {room.max_guests} guests</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold">₹{room.price}</span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      {room.property_id && (
                        <Button asChild>
                          <OptimizedLink href={`/property/${room.property_id}`} target="_blank" rel="noopener noreferrer">
                            View Property
                          </OptimizedLink>
                        </Button>
                      )}
                    </div>
                  </CardContent>
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
