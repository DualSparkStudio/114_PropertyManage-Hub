"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { OptimizedLink } from "@/components/optimized-link"
import { createProperty } from "@/lib/supabase/properties"

export default function AddPropertyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location: "",
    type: "",
    price: "",
    description: "",
    totalRooms: "",
    amenities: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const propertyData = {
        name: formData.name,
        slug: formData.slug,
        location: formData.location,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        description: formData.description || null,
        total_rooms: parseInt(formData.totalRooms) || 0,
        amenities: formData.amenities,
        rating: 0,
        reviews: 0,
      }

      await createProperty(propertyData)
      alert("Property created successfully!")
      router.push("/properties")
    } catch (error: any) {
      console.error("Error creating property:", error)
      alert(error.message || "Failed to create property. Please check the console for details.")
      setIsSubmitting(false)
    }
  }

  const commonAmenities = [
    "Wi-Fi",
    "Parking",
    "Restaurant",
    "Gym",
    "Spa",
    "Room Service",
    "Swimming Pool",
    "Business Center",
    "Laundry",
    "Air Conditioning",
    "TV",
    "Mini Bar",
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <OptimizedLink href="/properties">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </OptimizedLink>
          <PageHeader
            title="Add New Property"
            description="Create a new property in your system"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Grand Hotel"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="grand-hotel"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier (auto-generated from name)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="New York, USA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Resort">Resort</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price per Night *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="150"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms *</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange("totalRooms", e.target.value)}
                    placeholder="120"
                    min="1"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Description & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="A luxurious hotel located in the heart of New York City..."
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonAmenities.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <OptimizedLink href="/properties">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </OptimizedLink>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

