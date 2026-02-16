import {
  mockProperties,
  mockRoomTypes,
  mockFeatures,
  mockAttractions,
  mockAbout,
  mockContact,
  mockPropertyImages,
  mockBookings,
} from './mock-properties'

// Type definitions
export type Property = {
  id: string
  name: string
  slug: string
  type: string
  location: string
  description: string
  price: number
  rating: number
  reviews: number
  status: string
  image: string
  amenities?: string[]
}

export type RoomType = {
  id: string
  property_id: string
  name: string
  description: string
  price: number
  max_guests: number
  number_of_rooms: number
  amenities?: string[]
  images?: string[]
  beds?: string
  size?: string
  additional_price_per_extra_guest?: number
}

export async function getAllProperties(): Promise<Property[]> {
  return mockProperties
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return mockProperties.find(p => p.id === id) || null
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return mockProperties.find(p => p.slug === slug) || null
}

export async function getPropertyImages(propertyId: string) {
  return mockPropertyImages.filter(img => img.property_id === propertyId)
}

export async function getPropertyRoomTypes(propertyId: string): Promise<RoomType[]> {
  return mockRoomTypes.filter(room => room.property_id === propertyId)
}

export async function getPropertyFeatures(propertyId: string) {
  return mockFeatures.filter(feature => feature.property_id === propertyId)
}

export async function getPropertyAttractions(propertyId: string) {
  return mockAttractions.filter(attraction => attraction.property_id === propertyId)
}

export async function getPropertyAbout(propertyId: string) {
  return mockAbout.find(about => about.property_id === propertyId) || null
}

export async function getPropertyContact(propertyId: string) {
  return mockContact.find(contact => contact.property_id === propertyId) || null
}

export async function getRoomTypeById(roomTypeId: string): Promise<RoomType | null> {
  return mockRoomTypes.find(room => room.id === roomTypeId) || null
}

export async function getAllRoomTypes() {
  return mockRoomTypes.map(room => {
    const property = mockProperties.find(p => p.id === room.property_id)
    return {
      ...room,
      property_name: property?.name,
      property_id: property?.id,
      property_location: property?.location,
    }
  })
}

export async function calculateOccupancy(propertyId: string, totalRooms: number) {
  // Mock occupancy calculation - return random percentage
  return Math.floor(Math.random() * 40) + 60 // 60-100%
}


// Stub functions for admin features (not fully implemented with mock data)
export async function updateProperty(id: string, updates: any) {
  console.warn('updateProperty is not implemented with mock data')
  return mockProperties.find(p => p.id === id) || mockProperties[0]
}

export async function upsertRoomType(roomType: any) {
  console.warn('upsertRoomType is not implemented with mock data')
  return roomType
}

export async function deleteRoomType(roomTypeId: string) {
  console.warn('deleteRoomType is not implemented with mock data')
}

export async function updatePropertyStatus(id: string, status: string) {
  console.warn('updatePropertyStatus is not implemented with mock data')
}

export async function getBookingStats(propertyId: string) {
  // Return mock booking stats
  return {
    total_bookings: Math.floor(Math.random() * 100) + 50,
    total_revenue: Math.floor(Math.random() * 50000) + 10000,
    average_rating: 4.5 + Math.random() * 0.5,
  }
}


export async function getAllFeatures() {
  return mockFeatures.map(feature => {
    const property = mockProperties.find(p => p.id === feature.property_id)
    return {
      ...feature,
      property_name: property?.name,
      property_id: property?.id,
    }
  })
}

export async function getAllAttractions() {
  return mockAttractions.map(attraction => {
    const property = mockProperties.find(p => p.id === attraction.property_id)
    return {
      ...attraction,
      property_name: property?.name,
      property_id: property?.id,
      property_location: property?.location,
    }
  })
}

export async function createProperty(property: any) {
  console.warn('createProperty is not implemented with mock data')
  return property
}

export async function upsertRoomTypeImages(roomTypeId: string, images: string[]) {
  console.warn('upsertRoomTypeImages is not implemented with mock data')
}

export async function getAllBookings() {
  return mockBookings
}

export async function getBookingsWithDetails() {
  return mockBookings.map(booking => {
    const property = mockProperties.find(p => p.id === booking.property_id)
    const roomType = mockRoomTypes.find(r => r.id === booking.room_type_id)
    return {
      ...booking,
      property_name: property?.name,
      property_location: property?.location,
      room_type_name: roomType?.name,
    }
  })
}

export async function checkPropertyAvailability(propertyId: string, checkIn: string, checkOut: string) {
  // Mock availability check - always return available
  return true
}
