"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bed, Users, Square, MapPin } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"

export default function RoomsPage() {
  // Aggregate all rooms from all properties
  const allRooms = Object.values(propertyData).flatMap((property: any) => {
    if (!property.roomsData) return []
    return property.roomsData.map((room: any) => ({
      ...room,
      propertyName: property.name,
      propertySlug: property.slug,
      propertyLocation: property.location,
    }))
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="py-2 text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link href="/explore/rooms" className="py-2 border-b-2 border-primary text-primary font-medium">
                  Rooms
                </Link>
                <Link href="/explore/attractions" className="py-2 text-muted-foreground hover:text-foreground">
                  Attractions
                </Link>
                <Link href="/explore/features" className="py-2 text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/explore/about" className="py-2 text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="/explore/contact" className="py-2 text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
              <span className="hidden md:block text-muted-foreground">|</span>
              <nav className="flex items-center gap-6">
                <Link href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Available Rooms</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious accommodations across all properties</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allRooms.map((room, idx) => (
            <Card key={`${room.propertySlug}-${room.id}-${idx}`} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    {room.propertyName}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{room.propertyLocation}</span>
                </div>
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
                    <span>Up to 4 guests</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold">₹{room.price}</span>
                    <span className="text-sm text-muted-foreground">/night</span>
                  </div>
                  <Button asChild>
                    <Link href={`/property/${room.propertySlug}`}>View Property</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
