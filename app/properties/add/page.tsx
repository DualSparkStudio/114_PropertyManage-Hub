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
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { OptimizedLink } from "@/components/optimized-link"
import { createProperty, upsertRoomType, upsertRoomTypeImages } from "@/lib/supabase/properties"
import { supabase } from "@/lib/supabase/client"
import type { RoomType } from "@/lib/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AddPropertyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    price: "",
    description: "",
    amenities: [] as string[],
    phone: "",
    email: "",
    address: "",
    hours: "",
    mapEmbedUrl: "",
  })
  const [propertyImages, setPropertyImages] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<(RoomType & { image_urls?: string[] })[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<"property" | "rooms" | "contact">("property")
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageDialogUrl, setImageDialogUrl] = useState("")
  const [imageDialogContext, setImageDialogContext] = useState<{ type: 'property' | 'room'; roomIndex?: number } | null>(null)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleNext = () => {
    if (currentStep === "property") {
      setCurrentStep("rooms")
    } else if (currentStep === "rooms") {
      setCurrentStep("contact")
    }
  }

  const handleBack = () => {
    if (currentStep === "contact") {
      setCurrentStep("rooms")
    } else if (currentStep === "rooms") {
      setCurrentStep("property")
    }
  }

  const handleAddRoomType = () => {
    setRoomTypes([...roomTypes, {
      id: `new-${Date.now()}`,
      property_id: "",
      name: "New Room Type",
      price: 0,
      beds: "",
      size: "",
      image_url: null,
      image_urls: [],
      max_guests: 2,
      additional_price_per_extra_guest: 0,
      number_of_rooms: 1,
      description: null,
      amenities: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
  }

  const handleRoomTypeChange = (index: number, field: string, value: any) => {
    const updated = [...roomTypes]
    updated[index] = { ...updated[index], [field]: value }
    setRoomTypes(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep !== "contact") {
      handleNext()
      return
    }

    setIsSubmitting(true)

    try {
      const propertyData = {
        name: formData.name,
        slug: `property-${Date.now()}`, // Auto-generate slug (not used in URLs but required by schema)
        location: formData.location,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        description: formData.description || null,
        total_rooms: 0, // Will be calculated from room types
        amenities: formData.amenities,
        rating: 0,
        reviews: 0,
      }

      const property = await createProperty(propertyData)
      
      // Save property images (convert Google Drive links to direct image URLs)
      if (propertyImages.length > 0) {
        const imagesToInsert = propertyImages.map((url, index) => {
          // Convert Google Drive sharing links to direct image URLs
          let imageUrl = url
          // Check if it's a Google Drive link
          if (url.includes('drive.google.com')) {
            // Extract file ID from various Google Drive URL formats
            let fileId = null
            // Format: https://drive.google.com/file/d/FILE_ID/view
            const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
            if (fileMatch) {
              fileId = fileMatch[1]
            }
            // Format: https://drive.google.com/open?id=FILE_ID
            if (!fileId) {
              const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
              if (openMatch) {
                fileId = openMatch[1]
              }
            }
            // Convert to direct image URL
            if (fileId) {
              imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
            }
          }
          
          return {
            property_id: property.id,
            url: imageUrl,
            alt_text: `${propertyData.name} image ${index + 1}`,
            order_index: index,
          }
        })
        
        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imagesToInsert)
        
        if (imagesError) {
          console.error("Error saving property images:", imagesError)
        }
      }
      
      // Create room types
      for (const roomType of roomTypes) {
        const { image_urls, ...roomTypeData } = roomType
        
        // Convert Google Drive links in image_urls to direct image URLs
        let convertedImageUrls = image_urls || []
        if (convertedImageUrls.length > 0) {
          convertedImageUrls = convertedImageUrls.map((url: string) => {
            if (url.includes('drive.google.com')) {
              // Extract file ID from various Google Drive URL formats
              let fileId = null
              const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
              if (fileMatch) {
                fileId = fileMatch[1]
              }
              if (!fileId) {
                const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
                if (openMatch) {
                  fileId = openMatch[1]
                }
              }
              // Convert to direct image URL
              if (fileId) {
                return `https://drive.google.com/uc?export=view&id=${fileId}`
              }
            }
            return url
          })
        }
        
        const savedRoomType = await upsertRoomType({
          ...roomTypeData,
          property_id: property.id,
        })
        
        // Save room type images
        if (convertedImageUrls.length > 0) {
          try {
            await upsertRoomTypeImages(savedRoomType.id, convertedImageUrls)
            if (convertedImageUrls[0] && convertedImageUrls[0] !== savedRoomType.image_url) {
              await upsertRoomType({
                ...savedRoomType,
                image_url: convertedImageUrls[0],
              })
            }
          } catch (error: any) {
            console.warn('Error saving room type images:', error)
            if (convertedImageUrls[0]) {
              await upsertRoomType({
                ...savedRoomType,
                image_url: convertedImageUrls[0],
              })
            }
          }
        }
      }
      
      // Create property contact information if provided
      if (formData.phone || formData.email || formData.address || formData.hours || formData.mapEmbedUrl) {
        const { error: contactError } = await supabase
          .from('property_contact')
          .insert({
            property_id: property.id,
            phone: formData.phone || null,
            email: formData.email || null,
            address: formData.address || null,
            hours: formData.hours || null,
            map_embed_url: formData.mapEmbedUrl || null,
          })

        if (contactError) {
          console.error("Error creating property contact:", contactError)
        }
      }

      setNotificationMessage("Property created successfully!")
      setNotificationDialogOpen(true)
      setTimeout(() => {
        router.push("/properties")
      }, 1500)
    } catch (error: any) {
      console.error("Error creating property:", error)
      setNotificationMessage(error.message || "Failed to create property. Please check the console for details.")
      setNotificationDialogOpen(true)
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

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${currentStep === "property" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "property" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1
            </div>
            <span className="font-medium">Property Info</span>
          </div>
          <div className="w-16 h-0.5 bg-border"></div>
          <div className={`flex items-center gap-2 ${currentStep === "rooms" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "rooms" ? "bg-primary text-primary-foreground" : currentStep === "contact" ? "bg-muted" : "bg-muted"}`}>
              2
            </div>
            <span className="font-medium">Room Types</span>
          </div>
          <div className="w-16 h-0.5 bg-border"></div>
          <div className={`flex items-center gap-2 ${currentStep === "contact" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "contact" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              3
            </div>
            <span className="font-medium">Contact</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Property Information */}
          {currentStep === "property" && (
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
                </CardContent>
              </Card>

              {/* Property Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add multiple images for this property. The first image will be used as the hero image.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {propertyImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyImages.map((imageUrl, idx) => (
                        <div key={idx} className="relative h-32 w-full rounded-lg overflow-hidden group">
                          <img
                            src={imageUrl}
                            alt={`Property image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            onClick={() => {
                              setPropertyImages(propertyImages.filter((_, i) => i !== idx))
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImageDialogContext({ type: 'property' })
                      setImageDialogUrl("")
                      setImageDialogOpen(true)
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property Image
                  </Button>
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
          )}

          {/* Step 2: Room Types */}
          {currentStep === "rooms" && (
            <Card>
              <CardHeader>
                <CardTitle>Room Types</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add room types for this property. Each room type can have multiple rooms.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomTypes.map((roomType, idx) => (
                  <div key={roomType.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">Room Type {idx + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setRoomTypes(roomTypes.filter((_, i) => i !== idx))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Room Type Name *</Label>
                        <Input
                          value={roomType.name}
                          onChange={(e) => handleRoomTypeChange(idx, "name", e.target.value)}
                          placeholder="Deluxe Room"
                          required
                        />
                      </div>
                      <div>
                        <Label>Price (per night) *</Label>
                        <Input
                          type="number"
                          value={roomType.price}
                          onChange={(e) => handleRoomTypeChange(idx, "price", parseFloat(e.target.value) || 0)}
                          placeholder="150.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <Label>Beds *</Label>
                        <Input
                          value={roomType.beds}
                          onChange={(e) => handleRoomTypeChange(idx, "beds", e.target.value)}
                          placeholder="1 King Bed"
                          required
                        />
                      </div>
                      <div>
                        <Label>Max Guests *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={roomType.max_guests || 2}
                          onChange={(e) => handleRoomTypeChange(idx, "max_guests", parseInt(e.target.value) || 2)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Additional Price per Extra Guest</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={roomType.additional_price_per_extra_guest || 0}
                          onChange={(e) => handleRoomTypeChange(idx, "additional_price_per_extra_guest", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Number of Rooms *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={roomType.number_of_rooms || 1}
                          onChange={(e) => handleRoomTypeChange(idx, "number_of_rooms", parseInt(e.target.value) || 1)}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          How many rooms of this type exist?
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={roomType.description || ""}
                        onChange={(e) => handleRoomTypeChange(idx, "description", e.target.value)}
                        rows={2}
                        placeholder="Spacious room with city views"
                      />
                    </div>
                    <div>
                      <Label>Room Images</Label>
                      <div className="mt-2 space-y-2">
                        {roomType.image_urls && roomType.image_urls.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {roomType.image_urls.map((imageUrl, imgIdx) => (
                              <div key={imgIdx} className="relative h-24 w-full rounded-lg overflow-hidden group bg-muted">
                                <img
                                  src={imageUrl}
                                  alt={`${roomType.name} ${imgIdx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Failed to load image:', imageUrl)
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                  }}
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                  onClick={() => {
                                    const updated = [...roomTypes]
                                    updated[idx].image_urls = updated[idx].image_urls?.filter((_, i) => i !== imgIdx) || []
                                    setRoomTypes(updated)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-32 w-full border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No images added yet</p>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImageDialogContext({ type: 'room', roomIndex: idx })
                            setImageDialogUrl("")
                            setImageDialogOpen(true)
                          }}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Room Image
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRoomType}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room Type
                </Button>
                {roomTypes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No room types added yet. Click &quot;Add Room Type&quot; to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === "contact" && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add contact details for this property (optional)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (212) 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="info@hotel.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Park Avenue, New York, NY 10001"
                      rows={2}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the full address. This will be used to display a map on the contact page.
                    </p>
                    {formData.address && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                        <p className="text-sm font-medium whitespace-pre-line">{formData.address}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mapEmbedUrl">Map Embed Code or URL (Optional)</Label>
                    <Textarea
                      id="mapEmbedUrl"
                      value={formData.mapEmbedUrl}
                      onChange={(e) => {
                        let value = e.target.value.trim()
                        // If it's an iframe code, extract the src URL
                        if (value.includes('<iframe')) {
                          const srcMatch = value.match(/src=["']([^"']+)["']/)
                          if (srcMatch && srcMatch[1]) {
                            value = srcMatch[1]
                          }
                        }
                        handleInputChange("mapEmbedUrl", value)
                      }}
                      placeholder="Paste iframe code or embed URL: <iframe src=&quot;https://www.google.com/maps/embed?pb=...&quot;></iframe>"
                      rows={3}
                      className="resize-none font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the full iframe embed code or just the embed URL. The system will automatically extract the URL from iframe code.
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hours">Operating Hours</Label>
                    <Textarea
                      id="hours"
                      value={formData.hours}
                      onChange={(e) => handleInputChange("hours", e.target.value)}
                      placeholder="Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM"
                      rows={2}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter operating hours (e.g., &quot;Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM&quot;)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div>
              {currentStep !== "property" && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <OptimizedLink href="/properties">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </OptimizedLink>
              <Button type="submit" disabled={isSubmitting}>
                {currentStep === "contact" ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Creating..." : "Create Property"}
                  </>
                ) : (
                  <>
                    Next
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {imageDialogContext?.type === 'property' ? 'Add Property Image' : 'Add Room Image'}
            </DialogTitle>
            <DialogDescription>
              Enter the image URL. You can use Google Drive links or any direct image URL.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={imageDialogUrl}
              onChange={(e) => setImageDialogUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddImage()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImageDialogOpen(false)
                setImageDialogUrl("")
                setImageDialogContext(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddImage}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <AlertDialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {notificationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setNotificationDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )

  function handleAddImage() {
    if (!imageDialogUrl.trim() || !imageDialogContext) return

    const trimmedUrl = imageDialogUrl.trim()

    if (imageDialogContext.type === 'property') {
      setPropertyImages([...propertyImages, trimmedUrl])
      setNotificationMessage("Image URL added successfully! It may take 5-10 seconds for the image to be reflected. Please make sure to fill all fields before saving.")
      setNotificationDialogOpen(true)
    } else if (imageDialogContext.type === 'room' && imageDialogContext.roomIndex !== undefined) {
      const updated = [...roomTypes]
      if (!updated[imageDialogContext.roomIndex].image_urls) {
        updated[imageDialogContext.roomIndex].image_urls = []
      }
      updated[imageDialogContext.roomIndex].image_urls = [
        ...(updated[imageDialogContext.roomIndex].image_urls || []),
        trimmedUrl
      ]
      setRoomTypes(updated)
      setNotificationMessage("Image URL added successfully! It may take 5-10 seconds for the image to be reflected. Please make sure to fill all fields before saving.")
      setNotificationDialogOpen(true)
    }

    setImageDialogOpen(false)
    setImageDialogUrl("")
    setImageDialogContext(null)
  }
}
