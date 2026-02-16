"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bed, Users, Square, MapPin, Search } from "lucide-react"
import { getAllRoomTypes } from "@/lib/data/mock-data-helpers"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { OptimizedLink } from "@/components/optimized-link"

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [guestsFilter, setGuestsFilter] = useState("all")
  const [allLocations, setAllLocations] = useState<string[]>([])

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await getAllRoomTypes()
        setAllRooms(rooms)
        
        // Extract unique locations
        const locations = Array.from(new Set(rooms.map(r => r.property_location).filter(Boolean)))
        setAllLocations(locations)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  // Filter rooms based on all criteria
  const filteredRooms = useMemo(() => {
    let filtered = allRooms

    // Search by room name or property name
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(query) ||
          (room.property_name && room.property_name.toLowerCase().includes(query)) ||
          (room.description && room.description.toLowerCase().includes(query))
      )
    }

    // Filter by location
    if (locationFilter !== "all") {
      filtered = filtered.filter((room) => room.property_location === locationFilter)
    }

    // Filter by price range
    if (priceFilter !== "all") {
      filtered = filtered.filter((room) => {
        const price = room.price
        switch (priceFilter) {
          case "under-300":
            return price < 300
          case "300-500":
            return price >= 300 && price < 500
          case "500-700":
            return price >= 500 && price < 700
          case "over-700":
            return price >= 700
          default:
            return true
        }
      })
    }

    // Filter by number of guests
    if (guestsFilter !== "all") {
      const guests = parseInt(guestsFilter)
      filtered = filtered.filter((room) => room.max_guests >= guests)
    }

    return filtered
  }, [allRooms, searchQuery, locationFilter, priceFilter, guestsFilter])

  const resetFilters = () => {
    setSearchQuery("")
    setLocationFilter("all")
    setPriceFilter("all")
    setGuestsFilter("all")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="explore" onLogoClick={resetFilters} />
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
      <Navbar variant="explore" onLogoClick={resetFilters} />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/explore" },
              { label: "Rooms" },
            ]}
          />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Available Rooms</h1>
          <p className="text-muted-foreground">Choose from our selection of luxurious accommodations across all properties</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 p-4 md:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rooms or properties..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs mb-1">Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {allLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1">Price Range</Label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-300">Under $300</SelectItem>
                    <SelectItem value="300-500">$300 - $500</SelectItem>
                    <SelectItem value="500-700">$500 - $700</SelectItem>
                    <SelectItem value="over-700">Over $700</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1">Guests</Label>
                <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="2">2+ Guests</SelectItem>
                    <SelectItem value="4">4+ Guests</SelectItem>
                    <SelectItem value="6">6+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || locationFilter !== "all" || priceFilter !== "all" || guestsFilter !== "all"
                ? "No rooms found matching your filters."
                : "No rooms available at this time."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => {
              const roomImage = room.images && room.images.length > 0 
                ? room.images[0] 
                : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
              
              return (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-muted">
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
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    {room.property_location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{room.property_location}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {room.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {room.max_guests} guests</span>
                      </div>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold">${room.price}</span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      {room.property_id && (
                        <Button asChild size="sm">
                          <OptimizedLink href={`/property/${room.property_id}/room/${room.id}`} target="_blank" rel="noopener noreferrer">
                            View Details
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
