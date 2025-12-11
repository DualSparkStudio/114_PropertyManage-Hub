"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatsCard } from "@/components/reusable/stats-card"
import { Bed, DollarSign, TrendingUp, Image as ImageIcon, Edit, Save, X, Power, PowerOff } from "lucide-react"
import Image from "next/image"
import { updateProperty, getPropertyById, getPropertyImages, getPropertyRoomTypes, getPropertyFeatures, upsertRoomType, deleteRoomType, getRoomTypeImages, upsertRoomTypeImages, updatePropertyStatus, getPropertyContact } from "@/lib/supabase/properties"
import { calculateOccupancy, getBookingStats } from "@/lib/supabase/bookings"
import { supabase } from "@/lib/supabase/client"
import type { RoomType, Feature, PropertyContact } from "@/lib/types/database"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyDetailsClientProps {
  propertyId: string
}

export function PropertyDetailsClient({ propertyId }: PropertyDetailsClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [propertyData, setPropertyData] = useState({
    id: "",
    name: "",
    location: "",
    type: "",
    description: "",
    totalRooms: 0,
    price: 0,
    status: "active" as 'active' | 'inactive',
  })
  const [heroImage, setHeroImage] = useState("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<(RoomType & { image_urls?: string[] })[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [occupancy, setOccupancy] = useState<number>(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0)
  const [contactInfo, setContactInfo] = useState<PropertyContact | null>(null)
  const [contactFormData, setContactFormData] = useState({
    phone: "",
    email: "",
    address: "",
    hours: "",
  })

  useEffect(() => {
    async function fetchProperty() {
      try {
        // Get property by ID
        const property = await getPropertyById(propertyId)
        
        if (!property) {
          console.error(`Property not found by ID "${propertyId}"`)
          setLoading(false)
          return
        }
        
        const [images, roomTypesData, featuresData] = await Promise.all([
          getPropertyImages(property.id),
          getPropertyRoomTypes(property.id),
          getPropertyFeatures(property.id),
        ])
        
        // Fetch images for each room type
        const roomTypesWithImages = await Promise.all(
          roomTypesData.map(async (rt) => {
            try {
              const roomImages = await getRoomTypeImages(rt.id)
              return {
                ...rt,
                image_urls: roomImages.map(img => img.url),
              }
            } catch (error: any) {
              // Fallback to single image_url if room_type_images table doesn't exist yet
              // Handle PGRST205 (table not found) and other expected errors silently
              if (error?.code === 'PGRST205' || error?.code === 'PGRST116' || error?.message?.includes('schema cache') || error?.message?.includes('does not exist')) {
                return {
                  ...rt,
                  image_urls: rt.image_url ? [rt.image_url] : [],
                }
              }
              // Re-throw unexpected errors
              throw error
            }
          })
        )
        
        // Calculate actual total rooms from room types (ONLY from room types, no static fallback)
        const actualTotalRooms = roomTypesWithImages.reduce((sum, rt) => sum + (rt.number_of_rooms || 1), 0)
        
        setPropertyData({
          id: property.id,
          name: property.name,
          location: property.location,
          type: property.type,
          description: property.description || "",
          totalRooms: actualTotalRooms,
          price: property.price,
          status: (property.status as 'active' | 'inactive') || 'active',
        })
        setHeroImage(images[0]?.url || "")
        setGalleryImages(images.map(img => img.url))
        setRoomTypes(roomTypesWithImages)
        setAmenities(property.amenities || [])
        setFeatures(featuresData)
        
        // Fetch contact information
        try {
          const contactData = await getPropertyContact(property.id)
          if (contactData) {
            setContactInfo(contactData)
            setContactFormData({
              phone: contactData.phone || "",
              email: contactData.email || "",
              address: contactData.address || "",
              hours: contactData.hours || "",
            })
          } else {
            setContactInfo(null)
            setContactFormData({
              phone: "",
              email: "",
              address: "",
              hours: "",
            })
          }
        } catch (error) {
          // Silently handle 406 errors (RLS policy issues)
          console.warn(`Could not fetch contact for property ${property.id}:`, error)
          setContactInfo(null)
          setContactFormData({
            phone: "",
            email: "",
            address: "",
            hours: "",
          })
        }
        
        // Calculate occupancy and revenue (using only calculated rooms from room types)
        const occupancyRate = await calculateOccupancy(property.id, actualTotalRooms)
        
        // Calculate monthly revenue (current month)
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        
        const { data: monthlyBookings } = await supabase
          .from('bookings')
          .select('amount')
          .eq('property_id', property.id)
          .eq('status', 'confirmed')
          .gte('check_in', firstDayOfMonth)
          .lte('check_in', lastDayOfMonth)
        
        const revenue = monthlyBookings?.reduce((sum, b) => sum + Number(b.amount || 0), 0) || 0
        
        setOccupancy(occupancyRate)
        setMonthlyRevenue(revenue)
      } catch (error: any) {
        // Only log real errors, not expected table-not-found errors (PGRST205)
        // PGRST205 means the room_type_images table doesn't exist yet (migration not run)
        if (error?.code !== 'PGRST205' && !error?.message?.includes('schema cache') && !error?.message?.includes('room_type_images')) {
          console.error("Error fetching property:", error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId])

  const handleInputChange = (field: string, value: string | number) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Prepare updates object
      const updates: any = {
        name: propertyData.name || '',
        location: propertyData.location || '',
        type: propertyData.type || '',
        description: propertyData.description || '',
        total_rooms: propertyData.totalRooms || 0,
        price: propertyData.price || 0,
        amenities: amenities || [],
      }
      
      // Slug generation removed - using property ID in URLs instead
      
      // Update main property data - include ALL fields that can be edited
      // Supabase update() supports partial updates - it will only update the fields provided
      // This means even if only one field is changed, it will be saved
      await updateProperty(propertyData.id, updates)
      
      // Update gallery images (all images including hero)
      // This ensures hero image and gallery are always in sync
      if (galleryImages.length > 0) {
        // Delete all existing images for this property
        const { error: deleteError } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyData.id)
        
        if (deleteError) {
          console.warn('Error deleting old images:', deleteError)
        }
        
        // Insert all gallery images (including hero as first image)
        const imagesToInsert = galleryImages.map((url, index) => ({
          property_id: propertyData.id,
          url: url,
          alt_text: `${propertyData.name} image ${index + 1}`,
          order_index: index,
        }))
        
        const { error: insertError } = await supabase
          .from('property_images')
          .insert(imagesToInsert)
        
        if (insertError) {
          console.error('Error inserting gallery images:', insertError)
          throw insertError
        }
      } else if (heroImage) {
        // If only hero image is set but no gallery, update just the hero
        // Delete existing hero image (order_index 0)
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyData.id)
          .eq('order_index', 0)
        
        // Insert new hero image
        const { error: heroError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyData.id,
            url: heroImage,
            alt_text: `${propertyData.name} hero image`,
            order_index: 0,
          })
        
        if (heroError) {
          console.error('Error inserting hero image:', heroError)
          throw heroError
        }
      }
      
      // Update room types
      for (const roomType of roomTypes) {
        // Save room type (without image_urls, that's handled separately)
        const { image_urls, ...roomTypeData } = roomType
        const savedRoomType = await upsertRoomType({
          ...roomTypeData,
          property_id: propertyData.id,
        })
        
        // Save room type images
        if (image_urls && image_urls.length > 0) {
          try {
            await upsertRoomTypeImages(savedRoomType.id, image_urls)
            // Fallback: also save first image in image_url field for backward compatibility
            if (image_urls[0] && image_urls[0] !== savedRoomType.image_url) {
              await upsertRoomType({
                ...savedRoomType,
                image_url: image_urls[0],
              })
            }
          } catch (error: any) {
            // If table doesn't exist, just save first image in image_url field
            if (error?.status === 404 || error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
              console.warn('room_type_images table does not exist yet. Saving first image in image_url field.')
              if (image_urls[0]) {
                await upsertRoomType({
                  ...savedRoomType,
                  image_url: image_urls[0],
                })
              }
            } else {
              // Re-throw other errors
              throw error
            }
          }
        }
      }
      
      // Update features if they were modified
      // TODO: Implement feature updates if needed
      
      // Update or create contact information
      if (contactFormData.phone || contactFormData.email || contactFormData.address || contactFormData.hours) {
        const { error: contactError } = await supabase
          .from('property_contact')
          .upsert({
            property_id: propertyData.id,
            phone: contactFormData.phone || null,
            email: contactFormData.email || null,
            address: contactFormData.address || null,
            hours: contactFormData.hours || null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'property_id'
          })

        if (contactError) {
          console.error('Error updating property contact:', contactError)
          // Don't fail the whole operation if contact update fails
        }
      }
      
      alert("Property updated successfully!")
      setIsEditing(false)
      
      // Reload property data to get updated room types with new IDs
      window.location.reload()
    } catch (error: any) {
      console.error("Error updating property:", error)
      alert(error.message || "Failed to update property. Please check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false)
  }

  const handleStatusToggle = async () => {
    try {
      const newStatus = propertyData.status === 'active' ? 'inactive' : 'active'
      await updatePropertyStatus(propertyData.id, newStatus)
      setPropertyData({ ...propertyData, status: newStatus })
      alert(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } catch (error: any) {
      console.error('Error updating property status:', error)
      alert('Failed to update property status')
    }
  }

  // Calculate actual total rooms from room types
  const actualTotalRooms = roomTypes.reduce((sum, rt) => sum + (rt.number_of_rooms || 1), 0)

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Properties", href: "/properties" },
            { label: propertyData.name || "Property Details" },
          ]}
        />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {isEditing ? (
              <Input
                value={propertyData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-3xl font-bold border-none p-0 h-auto"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{propertyData.name}</h1>
            )}
            {isEditing ? (
              <Input
                value={propertyData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="text-muted-foreground border-none p-0 h-auto mt-1"
              />
            ) : (
              <p className="text-muted-foreground mt-1">{propertyData.location}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={propertyData.status === 'active' ? 'secondary' : 'default'}
                  onClick={handleStatusToggle}
                >
                  {propertyData.status === 'active' ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Property
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden group">
          <Image
            src={heroImage}
            alt={propertyData.name}
            fill
            className="object-cover"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                onClick={() => {
                  const url = prompt("Enter hero image URL:", heroImage)
                  if (url) {
                    setHeroImage(url)
                  }
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Change Image
              </Button>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Rooms"
            value={actualTotalRooms}
            icon={Bed}
            change={`${actualTotalRooms} total`}
            trend="up"
          />
          <StatsCard
            title="Occupancy Rate"
            value={`${occupancy}%`}
            icon={TrendingUp}
            change={`${actualTotalRooms} total rooms`}
            trend={occupancy > 0 ? "up" : "down"}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            change="Current month"
            trend={monthlyRevenue > 0 ? "up" : "down"}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={propertyData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1">{propertyData.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    {isEditing ? (
                      <Select
                        value={propertyData.type}
                        onValueChange={(value) => handleInputChange("type", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Resort">Resort</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 font-medium">{propertyData.type}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Location</Label>
                    {isEditing ? (
                      <Input
                        value={propertyData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium">{propertyData.location}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Rooms</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={propertyData.totalRooms}
                        onChange={(e) => handleInputChange("totalRooms", parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium">{actualTotalRooms}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={propertyData.status === 'active' ? 'default' : 'secondary'}>
                        {propertyData.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New booking received", time: "2 hours ago" },
                    { action: "Room 201 checked out", time: "5 hours ago" },
                    { action: "Maintenance completed", time: "1 day ago" },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-xl"
                    >
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room Types</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {roomTypes.map((roomType, idx) => (
                      <div key={roomType.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">Room Type {idx + 1}</h4>
                          {isEditing && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (!roomType.id.startsWith('new-')) {
                                  try {
                                    await deleteRoomType(roomType.id)
                                  } catch (error) {
                                    console.error('Error deleting room type:', error)
                                  }
                                }
                                setRoomTypes(roomTypes.filter((_, i) => i !== idx))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Room Images - Multiple */}
                        <div>
                          <Label>Room Images</Label>
                          <div className="mt-2 space-y-2">
                            {roomType.image_urls && roomType.image_urls.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {roomType.image_urls.map((imageUrl, imgIdx) => (
                                  <div key={imgIdx} className="relative h-32 w-full rounded-lg overflow-hidden group">
                                    <Image
                                      src={imageUrl}
                                      alt={`${roomType.name} ${imgIdx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                    {isEditing && (
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                        onClick={() => {
                                          const updated = [...roomTypes]
                                          updated[idx].image_urls = updated[idx].image_urls?.filter((_, i) => i !== imgIdx) || []
                                          setRoomTypes(updated)
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-32 w-full border-2 border-dashed rounded-lg flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">No images</p>
                              </div>
                            )}
                            {isEditing && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const url = prompt("Enter room image URL:")
                                  if (url) {
                                    const updated = [...roomTypes]
                                    if (!updated[idx].image_urls) {
                                      updated[idx].image_urls = []
                                    }
                                    updated[idx].image_urls = [...(updated[idx].image_urls || []), url]
                                    setRoomTypes(updated)
                                  }
                                }}
                              >
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Add Image
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Room Type Name</Label>
                            <Input
                              value={roomType.name}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].name = e.target.value
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Price (per night)</Label>
                            <Input
                              type="number"
                              value={roomType.price}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].price = parseFloat(e.target.value) || 0
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Beds</Label>
                            <Input
                              value={roomType.beds}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].beds = e.target.value
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Size</Label>
                            <Input
                              value={roomType.size}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].size = e.target.value
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Max Guests</Label>
                            <Input
                              type="number"
                              min="1"
                              value={roomType.max_guests || 2}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].max_guests = parseInt(e.target.value) || 2
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>Additional Price per Extra Guest</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={roomType.additional_price_per_extra_guest || 0}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].additional_price_per_extra_guest = parseFloat(e.target.value) || 0
                                setRoomTypes(updated)
                              }}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label>Number of Rooms</Label>
                            <Input
                              type="number"
                              min="1"
                              value={roomType.number_of_rooms || 1}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].number_of_rooms = parseInt(e.target.value) || 1
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={roomType.description || ""}
                            onChange={(e) => {
                              const updated = [...roomTypes]
                              updated[idx].description = e.target.value
                              setRoomTypes(updated)
                            }}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRoomTypes([...roomTypes, {
                          id: `new-${Date.now()}`,
                          property_id: propertyData.id,
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
                      }}
                    >
                      Add Room Type
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roomTypes.length > 0 ? roomTypes.map((roomType) => (
                      <div key={roomType.id} className="p-4 border rounded-lg">
                        <div className="flex gap-4">
                          {roomType.image_urls && roomType.image_urls.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                              {roomType.image_urls.slice(0, 4).map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative h-24 w-24 rounded-lg overflow-hidden">
                                  <Image
                                    src={imgUrl}
                                    alt={`${roomType.name} ${imgIdx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : roomType.image_url ? (
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={roomType.image_url}
                                alt={roomType.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="flex-1">
                            <h4 className="font-semibold">{roomType.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-medium">${roomType.price}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Beds: </span>
                                <span className="font-medium">{roomType.beds}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Size: </span>
                                <span className="font-medium">{roomType.size}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Guests: </span>
                                <span className="font-medium">{roomType.max_guests || 2}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Extra Guest: </span>
                                <span className="font-medium">${roomType.additional_price_per_extra_guest || 0}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Rooms: </span>
                                <span className="font-medium">{roomType.number_of_rooms || 1}</span>
                              </div>
                            </div>
                            {roomType.description && (
                              <p className="text-sm text-muted-foreground mt-2">{roomType.description}</p>
                            )}
                            {roomType.image_urls && roomType.image_urls.length > 4 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                +{roomType.image_urls.length - 4} more images
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground py-8">
                        No room types found
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "Wi-Fi",
                        "Swimming Pool",
                        "Gym",
                        "Spa",
                        "Restaurant",
                        "Parking",
                        "Room Service",
                        "Laundry",
                        "Business Center",
                        "Air Conditioning",
                        "TV",
                        "Mini Bar",
                      ].map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-accent"
                        >
                          <input
                            type="checkbox"
                            checked={amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAmenities([...amenities, amenity])
                              } else {
                                setAmenities(amenities.filter(a => a !== amenity))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <Label>Custom Amenity</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="custom-amenity"
                          placeholder="Add custom amenity"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              const value = e.currentTarget.value.trim()
                              if (value && !amenities.includes(value)) {
                                setAmenities([...amenities, value])
                                e.currentTarget.value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.length > 0 ? amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 p-3 border rounded-xl"
                      >
                        <Badge variant="secondary">{amenity}</Badge>
                      </div>
                    )) : (
                      <p className="text-muted-foreground">No amenities added</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage contact details for this property
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={contactFormData.phone}
                        onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                        placeholder="+1 (212) 555-0123"
                      />
                    ) : (
                      <p className="text-sm font-medium">{contactInfo?.phone || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactFormData.email}
                        onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                        placeholder="info@hotel.com"
                      />
                    ) : (
                      <p className="text-sm font-medium">{contactInfo?.email || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact-address">Address</Label>
                    {isEditing ? (
                      <>
                        <Textarea
                          id="contact-address"
                          value={contactFormData.address}
                          onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
                          placeholder="123 Park Avenue, New York, NY 10001"
                          rows={2}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the full address. This will be used to display a map on the contact page.
                        </p>
                        {contactFormData.address && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                            <p className="text-sm font-medium whitespace-pre-line">{contactFormData.address}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-medium whitespace-pre-line">{contactInfo?.address || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact-hours">Operating Hours</Label>
                    {isEditing ? (
                      <>
                        <Textarea
                          id="contact-hours"
                          value={contactFormData.hours}
                          onChange={(e) => setContactFormData({ ...contactFormData, hours: e.target.value })}
                          placeholder="Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM"
                          rows={2}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter operating hours (e.g., &quot;Front Desk: 24/7 | Restaurant: 6:00 AM - 11:00 PM&quot;)
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium whitespace-pre-line">{contactInfo?.hours || "Not set"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gallery</CardTitle>
                  {isEditing && (
                    <Button
                      onClick={() => {
                        const url = prompt("Enter image URL:")
                        if (url) {
                          setGalleryImages([...galleryImages, url])
                        }
                      }}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Image URL
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryImages.map((imageUrl, idx) => (
                        <div
                          key={idx}
                          className="relative h-32 w-full rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Gallery ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setGalleryImages(galleryImages.filter((_, i) => i !== idx))
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {galleryImages.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No images in gallery. Click &quot;Add Image URL&quot; to add images.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.length > 0 ? galleryImages.map((imageUrl, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 w-full rounded-xl overflow-hidden"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )) : (
                      <p className="text-muted-foreground col-span-full text-center py-8">
                        No images in gallery
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        guest: "John Doe",
                        checkIn: "2024-01-15",
                        checkOut: "2024-01-18",
                        status: "Confirmed",
                        amount: "$450",
                      },
                      {
                        guest: "Jane Smith",
                        checkIn: "2024-01-20",
                        checkOut: "2024-01-25",
                        status: "Pending",
                        amount: "$600",
                      },
                    ].map((booking, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {booking.guest}
                        </TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "Confirmed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}


