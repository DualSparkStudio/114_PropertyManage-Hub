"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Bed, Bath, Users, Wifi, Car, Utensils, Star, Calendar } from "lucide-react"

const propertyData = {
  "1": {
    name: "Grand Hotel",
    location: "New York, USA",
    price: 150,
    rating: 4.8,
    reviews: 324,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&sig=2",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&sig=3",
    ],
    description: "A luxurious hotel located in the heart of New York City, offering world-class amenities and exceptional service.",
    amenities: ["Wi-Fi", "Parking", "Restaurant", "Gym", "Spa", "Room Service"],
    rooms: 120,
    type: "Hotel",
  },
}

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ]
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const property = propertyData[params.id as keyof typeof propertyData] || propertyData["1"]
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }
    router.push(`/checkout?property=${params.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const totalPrice = nights * property.price

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/explore" className="text-sm font-medium hover:text-primary">
                Explore
              </Link>
              <Link href="/admin" className="text-sm font-medium hover:text-primary">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Name & Rating */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="relative h-32 md:h-48 rounded-xl overflow-hidden">
                    <Image src={img} alt={`${property.name} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About this property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{property.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{property.rooms} Rooms</p>
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
              </TabsContent>
              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">JD</span>
                            </div>
                            <div>
                              <p className="font-medium">John Doe</p>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Amazing stay! The hotel exceeded all expectations. Great location and excellent service.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold">${property.price}</span>
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
                      <span>${property.price} x {nights} nights</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>${Math.round(totalPrice * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${totalPrice + Math.round(totalPrice * 0.1)}</span>
                    </div>
                  </div>
                )}
                <Button className="w-full" size="lg" onClick={handleBookNow}>
                  Book Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

