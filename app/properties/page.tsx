"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { PageHeader } from "@/components/reusable/page-header"
import { PropertyCard } from "@/components/reusable/property-card"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAllProperties, getPropertyImages, getPropertyRoomTypes } from "@/lib/supabase/properties"
import { calculateOccupancy } from "@/lib/supabase/bookings"
import { supabase } from "@/lib/supabase/client"

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [locations, setLocations] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])

  const fetchProperties = async () => {
    try {
      const data = await getAllProperties()
      
      // Get unique locations and types from database
      const uniqueLocations = [...new Set(data.map(p => p.location))].sort()
      const uniqueTypes = [...new Set(data.map(p => p.type))].sort()
      setLocations(uniqueLocations)
      setTypes(uniqueTypes)

      // Fetch images, room types, and occupancy for each property
      const propertiesWithDetails = await Promise.all(
        data.map(async (property) => {
          const [images, roomTypes] = await Promise.all([
            getPropertyImages(property.id),
            getPropertyRoomTypes(property.id),
          ])
          
          // Calculate actual total rooms from room types (ONLY from room types, no static fallback)
          const actualTotalRooms = roomTypes.reduce((sum, rt) => sum + (rt.number_of_rooms || 1), 0)
          
          const occupancy = await calculateOccupancy(property.id, actualTotalRooms)
          return {
            id: property.id,
            name: property.name,
            type: property.type,
            location: property.location,
            rooms: actualTotalRooms,
            occupancy,
            image: images[0]?.url || '',
            status: property.status || 'active',
          }
        })
      )
      setProperties(propertiesWithDetails)
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = !searchQuery || 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLocation = selectedLocation === "all" || property.location === selectedLocation
    const matchesType = selectedType === "all" || property.type === selectedType
    const matchesStatus = selectedStatus === "all" || property.status === selectedStatus

    return matchesSearch && matchesLocation && matchesType && matchesStatus
  })
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Properties" },
          ]}
        />
      </div>
      <div className="space-y-6">
        <PageHeader
          title="Properties"
          description="Manage all your properties from one place"
          action={{
            label: "Add New Property",
            onClick: () => router.push("/properties/add"),
            icon: Plus,
          }}
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Search properties..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {locations.length > 0 && (
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {types.length > 0 && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedLocation !== "all" || selectedType !== "all" || selectedStatus !== "all"
                ? "No properties found matching your filters."
                : "No properties found. Add your first property to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} onUpdate={fetchProperties} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

