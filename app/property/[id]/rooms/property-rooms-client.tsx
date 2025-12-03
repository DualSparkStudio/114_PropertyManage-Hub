"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Users, Square } from "lucide-react"
import { propertyData } from "@/lib/data/property-data"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

interface PropertyRoomsClientProps {
  propertySlug: string
}

export function PropertyRoomsClient({ propertySlug }: PropertyRoomsClientProps) {
  const property = propertyData[propertySlug] || propertyData["grand-hotel"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertySlug={propertySlug} />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Rooms - {property.name}</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious accommodations</p>
        </div>

        <div className="space-y-6">
          {property.roomsData?.map((room: any) => (
            <Card key={room.id}>
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="relative h-64 md:h-48 md:w-64 rounded-lg overflow-hidden">
                  <Image
                    src={room.image}
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
                      <span>Up to 4 guests</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-3xl font-bold">₹{room.price}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                    <Button asChild>
                      <Link href={`/property/${propertySlug}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

