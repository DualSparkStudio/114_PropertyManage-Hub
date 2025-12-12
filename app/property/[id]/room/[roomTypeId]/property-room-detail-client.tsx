"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bed, 
  Users, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  Wind,
  Droplet,
  Coffee,
  Shirt,
  Battery,
  Sparkles,
  CheckCircle2,
  MapPin,
  Star
} from "lucide-react"
import { getPropertyById, getPropertyRoomTypes, getRoomTypeImages } from "@/lib/supabase/properties"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { convertGoogleDriveUrl } from "@/lib/utils/convert-google-drive-url"
import type { Property, RoomType } from "@/lib/types/database"

interface PropertyRoomDetailClientProps {
  propertyId: string
  roomTypeId: string
}

export function PropertyRoomDetailClient({ propertyId, roomTypeId }: PropertyRoomDetailClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [roomType, setRoomType] = useState<(RoomType & { image_urls?: string[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    async function fetchData() {
      try {
        // Extract IDs from URL path
        let propId = propertyId
        let roomId = roomTypeId
        
        if (!propId && typeof window !== 'undefined') {
          const pathParts = pathname.split('/').filter(Boolean)
          const propertyIndex = pathParts.indexOf('property')
          if (propertyIndex !== -1 && pathParts[propertyIndex + 1]) {
            propId = pathParts[propertyIndex + 1]
          }
        }
        
        if (!roomId && typeof window !== 'undefined') {
          const pathParts = pathname.split('/').filter(Boolean)
          const roomIndex = pathParts.indexOf('room')
          if (roomIndex !== -1 && pathParts[roomIndex + 1]) {
            roomId = pathParts[roomIndex + 1]
          }
        }
        
        if (!propId || !roomId) {
          console.error("Property ID or Room Type ID not found")
          setLoading(false)
          return
        }
        
        const prop = await getPropertyById(propId)
        if (prop) {
          setProperty(prop)
          const roomTypes = await getPropertyRoomTypes(prop.id)
          const room = roomTypes.find(rt => rt.id === roomId)
          
          if (room) {
            // Fetch images for the room type
            try {
              const roomImages = await getRoomTypeImages(room.id)
              if (roomImages && roomImages.length > 0) {
                setRoomType({
                  ...room,
                  image_urls: roomImages.map(img => convertGoogleDriveUrl(img.url)),
                })
              } else {
                setRoomType({
                  ...room,
                  image_urls: room.image_url ? [convertGoogleDriveUrl(room.image_url)] : [],
                })
              }
            } catch {
              setRoomType({
                ...room,
                image_urls: room.image_url ? [convertGoogleDriveUrl(room.image_url)] : [],
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching room details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [propertyId, roomTypeId, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading room details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property || !roomType) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="property" propertyId={propertyId} />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Room not found</p>
            <Link href={`/property/${propertyId}/rooms`} className="text-primary hover:underline mt-4 inline-block">
              Back to Rooms
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const allImages = roomType.image_urls && roomType.image_urls.length > 0
    ? roomType.image_urls
    : roomType.image_url
      ? [convertGoogleDriveUrl(roomType.image_url)]
      : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleBookNow = () => {
    if (checkIn && checkOut) {
      router.push(`/checkout?property=${propertyId}&roomType=${roomType.id}&roomName=${encodeURIComponent(roomType.name)}&roomPrice=${roomType.price}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
    } else {
      // Scroll to booking widget or show message
      alert("Please select check-in and check-out dates")
    }
  }

  // Default amenities if not in database
  const defaultAmenities = [
    { icon: Wifi, label: "Free wifi" },
    { icon: Wind, label: "Air conditioned" },
    { icon: Droplet, label: "Hot water geyser" },
    { icon: Coffee, label: "Hot water kettle" },
    { icon: Shirt, label: "Wardrobe with dressing table" },
    { icon: Battery, label: "Battery backup for fans and lights" },
    { icon: Sparkles, label: "Toiletries included" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="property" propertyId={propertyId} />

      <div className="container mx-auto px-6 py-8">
        {/* Back Link */}
        <Link 
          href={`/property/${propertyId}/rooms`}
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Rooms
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative h-96 rounded-lg overflow-hidden group">
              <img
                src={allImages[currentImageIndex]}
                alt={roomType.name}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1}/{allImages.length}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-xs">
                    Click to view full size
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-20 rounded overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${roomType.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Click thumbnails to view different images. Click main image to view full size.
                </p>
              </div>
            )}

            {/* Room Details */}
            <div className="space-y-6 mt-8">
              {/* Room Name and Price */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{roomType.name}</h1>
                <p className="text-2xl font-semibold text-primary">
                  ₹{roomType.price} <span className="text-base text-muted-foreground font-normal">per night</span>
                </p>
              </div>

              {/* Short Description */}
              {roomType.description && (
                <p className="text-muted-foreground">{roomType.description}</p>
              )}

              {/* Accommodation Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {roomType.max_guests > 2 
                      ? `Double occupancy, extra mattresses can be added. Total ${roomType.max_guests} guests can be comfortably accommodated.`
                      : `Up to ${roomType.max_guests} guests can be accommodated.`
                    }
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Max Guests</span>
                    <span className="text-lg font-bold">{roomType.max_guests}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Star className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Rating</span>
                    <span className="text-lg font-bold">5.0</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <MapPin className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm font-bold text-center">River View</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Status</span>
                    <span className="text-sm font-bold">Available</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {defaultAmenities.map((amenity, idx) => {
                    const Icon = amenity.icon
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* House Rules */}
              <div>
                <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Alcohol drinking is not allowed.</li>
                  <li>Outside visitors are not allowed without prior permission.</li>
                  <li>Photo IDs and address proofs of all guests are must before check in.</li>
                  <li>Pets are allowed with responsibility of proper cleaning.</li>
                  <li>Any damage to furniture, linens will be recovered.</li>
                  <li>Guest to use electricity judiciously and put off when not in use.</li>
                  <li>We are not providing any accommodation for drivers.</li>
                  <li>Wash the feet outside after visiting the beach to maintain cleanliness.</li>
                  <li>All the rooms have double occupancy. Extra mattress will be charged @₹{roomType.additional_price_per_extra_guest || 200}/- per day.</li>
                  <li>Auto, Car, two wheeler can be arranged if required.</li>
                  <li>If you have any issue, concern you may please bring it to notice instantly.</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                  Please ensure you follow all house rules during your stay. For any questions, please contact our staff.
                </p>
              </div>

              {/* About This Room */}
              <div>
                <h2 className="text-xl font-semibold mb-4">About This Room</h2>
                {roomType.description && (
                  <p className="text-muted-foreground mb-4">{roomType.description}</p>
                )}
                <p className="text-muted-foreground">
                  Experience the perfect blend of luxury and comfort in this beautifully appointed room. Every detail has been carefully curated to ensure your stay is nothing short of exceptional. From the premium bedding to the state-of-the-art amenities, you&apos;ll find everything you need for a memorable vacation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Book This Room</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Check-in Date</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkout">Check-out Date</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select value={guests.toString()} onValueChange={(val) => setGuests(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: roomType.max_guests }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBookNow}
                    disabled={!checkIn || !checkOut}
                  >
                    Select Dates to Book
                  </Button>
                  
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <h3 className="font-semibold">Check-in & Check-out Times</h3>
                    <p className="text-muted-foreground">Check-in: 12PM onwards</p>
                    <p className="text-muted-foreground">Check-out: 10AM</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Free cancellation up to 24 hours before check-in</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">No prepayment required</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Instant confirmation</span>
                    </div>
                  </div>
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

