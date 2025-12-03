"use client"

import { useState, useMemo, memo } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MapPin, Bed, Star, Search, Menu } from "lucide-react"

const properties = [
  {
    id: "1",
    slug: "grand-hotel",
    name: "Grand Hotel",
    type: "Hotel",
    location: "New York, USA",
    price: 150,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    description: "Luxurious hotel in the heart of New York City",
  },
  {
    id: "2",
    slug: "beach-resort",
    name: "Beach Resort",
    type: "Resort",
    location: "Miami, USA",
    price: 180,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    description: "Stunning beachfront resort with ocean views",
  },
  {
    id: "3",
    slug: "mountain-villa",
    name: "Mountain Villa",
    type: "Villa",
    location: "Aspen, USA",
    price: 350,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    description: "Private villa with mountain views",
  },
  {
    id: "4",
    slug: "city-hotel",
    name: "City Hotel",
    type: "Hotel",
    location: "San Francisco, USA",
    price: 200,
    rating: 4.6,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    description: "Modern hotel in downtown San Francisco",
  },
  {
    id: "5",
    slug: "lakeside-resort",
    name: "Lakeside Resort",
    type: "Resort",
    location: "Lake Tahoe, USA",
    price: 220,
    rating: 4.9,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    description: "Peaceful resort by the lake",
  },
  {
    id: "6",
    slug: "desert-oasis",
    name: "Desert Oasis",
    type: "Resort",
    location: "Phoenix, USA",
    price: 190,
    rating: 4.5,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    description: "Luxury desert resort with spa facilities",
  },
]

// Memoized property card component
const PropertyCard = memo(function PropertyCard({ property }: { property: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
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
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">₹{property.price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {property.reviews} reviews
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <OptimizedLink 
            href={`/property/${property.slug}`} 
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
  
  // Memoize filtered properties
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties
    const query = searchQuery.toLowerCase()
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <div className="flex items-center gap-4 md:gap-8">
              <nav className="hidden md:flex items-center gap-6">
                <OptimizedLink href="/explore" className="py-2 border-b-2 border-primary text-primary font-medium">
                  Home
                </OptimizedLink>
                <OptimizedLink href="/explore/rooms" className="py-2 text-muted-foreground hover:text-foreground">
                  Rooms
                </OptimizedLink>
                <OptimizedLink href="/explore/attractions" className="py-2 text-muted-foreground hover:text-foreground">
                  Attractions
                </OptimizedLink>
                <OptimizedLink href="/explore/features" className="py-2 text-muted-foreground hover:text-foreground">
                  Features
                </OptimizedLink>
                <OptimizedLink href="/explore/about" className="py-2 text-muted-foreground hover:text-foreground">
                  About
                </OptimizedLink>
                <OptimizedLink href="/explore/contact" className="py-2 text-muted-foreground hover:text-foreground">
                  Contact
                </OptimizedLink>
              </nav>
              <span className="hidden md:block text-muted-foreground">|</span>
              <nav className="hidden sm:flex items-center gap-4 md:gap-6">
                <OptimizedLink href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </OptimizedLink>
                <OptimizedLink href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </OptimizedLink>
              </nav>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    <OptimizedLink href="/explore" className="py-2 border-b-2 border-primary text-primary font-medium">
                      Home
                    </OptimizedLink>
                    <OptimizedLink href="/explore/rooms" className="py-2 text-muted-foreground hover:text-foreground">
                      Rooms
                    </OptimizedLink>
                    <OptimizedLink href="/explore/attractions" className="py-2 text-muted-foreground hover:text-foreground">
                      Attractions
                    </OptimizedLink>
                    <OptimizedLink href="/explore/features" className="py-2 text-muted-foreground hover:text-foreground">
                      Features
                    </OptimizedLink>
                    <OptimizedLink href="/explore/about" className="py-2 text-muted-foreground hover:text-foreground">
                      About
                    </OptimizedLink>
                    <OptimizedLink href="/explore/contact" className="py-2 text-muted-foreground hover:text-foreground">
                      Contact
                    </OptimizedLink>
                    <div className="pt-4 border-t">
                      <OptimizedLink href="/explore" className="block py-2 text-sm font-medium hover:text-primary">
                        Explore
                      </OptimizedLink>
                      <OptimizedLink href="/admin" className="block py-2 text-sm font-medium hover:text-primary">
                        Admin
                      </OptimizedLink>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
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
              <Select>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="miami">Miami</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
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
            {properties.length} properties available
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  )
}

