"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatsCard } from "@/components/reusable/stats-card"
import { Bed, DollarSign, TrendingUp, Image as ImageIcon, Edit, Save, X } from "lucide-react"
import Image from "next/image"
import { updateProperty, getPropertyBySlug, getPropertyImages, getPropertyRoomTypes, getPropertyFeatures, upsertRoomType, deleteRoomType, getRoomTypeImages, upsertRoomTypeImages } from "@/lib/supabase/properties"
import { supabase } from "@/lib/supabase/client"
import type { RoomType, Feature } from "@/lib/types/database"
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
    status: "Active",
  })
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<(RoomType & { image_urls?: string[] })[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    async function fetchProperty() {
      try {
        // Try to get by ID first, then by slug
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (error || !data) {
          // If not found by ID, try to get by slug
          console.log(`Property not found by ID "${propertyId}", trying slug...`)
          const property = await getPropertyBySlug(propertyId)
          if (property) {
            console.log(`Property found by slug:`, property.id)
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
                } catch (error) {
                  // Fallback to single image_url if room_type_images table doesn't exist yet
                  return {
                    ...rt,
                    image_urls: rt.image_url ? [rt.image_url] : [],
                  }
                }
              })
            )
            
            setPropertyData({
              id: property.id,
              name: property.name,
              location: property.location,
              type: property.type,
              description: property.description || "",
              totalRooms: property.total_rooms,
              price: property.price,
              status: "Active",
            })
            setHeroImage(images[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200")
            setGalleryImages(images.map(img => img.url))
            setRoomTypes(roomTypesWithImages)
            setAmenities(property.amenities || [])
            setFeatures(featuresData)
          } else {
            console.error(`Property with id/slug "${propertyId}" not found in database. Please ensure the seed data has been run.`)
            setLoading(false)
            return
          }
        } else {
          console.log(`Property found by ID:`, data.id)
          const [images, roomTypesData, featuresData] = await Promise.all([
            getPropertyImages(data.id),
            getPropertyRoomTypes(data.id),
            getPropertyFeatures(data.id),
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
              } catch (error) {
                // Fallback to single image_url if room_type_images table doesn't exist yet
                return {
                  ...rt,
                  image_urls: rt.image_url ? [rt.image_url] : [],
                }
              }
            })
          )
          
          setPropertyData({
            id: data.id,
            name: data.name,
            location: data.location,
            type: data.type,
            description: data.description || "",
            totalRooms: data.total_rooms,
            price: data.price,
            status: "Active",
          })
          setHeroImage(images[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200")
          setGalleryImages(images.map(img => img.url))
          setRoomTypes(roomTypesWithImages)
          setAmenities(data.amenities || [])
          setFeatures(featuresData)
        }
      } catch (error) {
        console.error("Error fetching property:", error)
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
    try {
      // Update main property data
      await updateProperty(propertyData.id, {
        name: propertyData.name,
        location: propertyData.location,
        type: propertyData.type,
        description: propertyData.description,
        total_rooms: propertyData.totalRooms,
        amenities: amenities,
      })
      
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
          } catch (error) {
            console.warn('Could not save room type images (table might not exist yet):', error)
            // Fallback: save first image in image_url field
            if (image_urls[0]) {
              await upsertRoomType({
                ...savedRoomType,
                image_url: image_urls[0],
              })
            }
          }
        }
      }
      
      // TODO: Update gallery images and features
      
      alert("Property updated successfully!")
      setIsEditing(false)
      
      // Reload property data to get updated room types with new IDs
      window.location.reload()
    } catch (error: any) {
      console.error("Error updating property:", error)
      alert(error.message || "Failed to update property. Please check the console for details.")
    }
  }

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false)
  }

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
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </Button>
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
            value={propertyData.totalRooms}
            icon={Bed}
            change={`${propertyData.totalRooms} total`}
            trend="up"
          />
          <StatsCard
            title="Occupancy Rate"
            value="92%"
            icon={TrendingUp}
            change="+5% from last month"
            trend="up"
          />
          <StatsCard
            title="Monthly Revenue"
            value="$45,200"
            icon={DollarSign}
            change="+12% from last month"
            trend="up"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
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
                      <p className="mt-1 font-medium">{propertyData.totalRooms}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant="success">{propertyData.status}</Badge>
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

                        <div className="grid grid-cols-2 gap-4">
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
                            <Label>Price</Label>
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
                            <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
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

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Table</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {roomTypes.map((roomType, idx) => (
                      <div key={roomType.id} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Room Type</Label>
                            <Input value={roomType.name} disabled />
                          </div>
                          <div>
                            <Label>Base Price</Label>
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
                            <Label>Max Guests</Label>
                            <Input
                              type="number"
                              value={roomType.max_guests}
                              onChange={(e) => {
                                const updated = [...roomTypes]
                                updated[idx].max_guests = parseInt(e.target.value) || 2
                                setRoomTypes(updated)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Max Guests</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomTypes.length > 0 ? roomTypes.map((roomType) => (
                        <TableRow key={roomType.id}>
                          <TableCell className="font-medium">{roomType.name}</TableCell>
                          <TableCell>${roomType.price}</TableCell>
                          <TableCell>{roomType.max_guests}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No pricing data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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


