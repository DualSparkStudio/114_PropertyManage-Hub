"use client"

import { useState, useMemo, memo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { OptimizedLink } from "@/components/optimized-link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Star, Search } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getAllProperties, getPropertyImages } from "@/lib/supabase/properties"

// Memoized property card component
const PropertyCard = memo(function PropertyCard({ property }: { property: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Bed className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90">
            {property.type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold">{property.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{property.location}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {property.description}
        </p>
        <div className="flex items-center justify-end">
          <span className="text-sm text-muted-foreground">
            {property.reviews} reviews
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
            <OptimizedLink 
            href={`/property/${property.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Details
          </OptimizedLink>
        </Button>
      </CardFooter>
    </Card>
  )
})

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [properties, setProperties] = useState<any[]>([])
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [allTypes, setAllTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const resetSearch = () => {
    setSearchQuery("")
    setLocationFilter("all")
    setTypeFilter("all")
  }
  
  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await getAllProperties()
        
        // Extract unique locations and types from database
        const locations = Array.from(new Set(data.map(p => p.location).filter(Boolean)))
        const types = Array.from(new Set(data.map(p => p.type).filter(Boolean)))
        setAllLocations(locations)
        setAllTypes(types)
        
        // Fetch images for each property - show all properties even without images or rooms
        const propertiesWithImages = await Promise.all(
          data.map(async (property) => {
            const images = await getPropertyImages(property.id)
            return {
              id: property.id,
              name: property.name,
              type: property.type,
              location: property.location,
              price: property.price,
              rating: property.rating,
              reviews: property.reviews,
              image: images[0]?.url || null,
              description: property.description || "",
            }
          })
        )
        // Show all properties regardless of images or room count
        setProperties(propertiesWithImages)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])
  
  // Memoize filtered properties
  const filteredProperties = useMemo(() => {
    let filtered = properties
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      )
    }
    
    // Filter by location
    if (locationFilter !== "all") {
      filtered = filtered.filter((p) => p.location === locationFilter)
    }
    
    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type.toLowerCase() === typeFilter.toLowerCase())
    }
    
    return filtered
  }, [searchQuery, locationFilter, typeFilter, properties])

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" onLogoClick={resetSearch} />

      {/* Hero Section */}
      <section className="relative py-8 md:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
              alt="Luxury hotel"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing hotels, resorts, and villas around the world
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search destinations, properties..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Location" />
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full md:w-auto">Search</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Available Properties</h2>
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `${properties.length} properties available`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No properties found matching your search." : "No properties available yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}


