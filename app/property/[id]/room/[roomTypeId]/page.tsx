import { PropertyRoomDetailClient } from "./property-room-detail-client"
import { getAllProperties } from "@/lib/supabase/properties"

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties()
    if (properties.length === 0) {
      // Return placeholder - client component will extract ID from URL
      return [{ id: '_', roomTypeId: '_' }]
    }
    // Generate routes for all properties and their room types
    // This ensures the route exists for static export
    const params: { id: string; roomTypeId: string }[] = []
    
    for (const property of properties) {
      try {
        const { getPropertyRoomTypes } = await import('@/lib/supabase/properties')
        const roomTypes = await getPropertyRoomTypes(property.id)
        if (roomTypes.length > 0) {
          // Add a route for each room type
          roomTypes.forEach(rt => {
            params.push({ id: property.id, roomTypeId: rt.id })
          })
        } else {
          // Still add a route for the property even if no room types
          params.push({ id: property.id, roomTypeId: '_' })
        }
      } catch (error) {
        // If we can't fetch room types, still add a placeholder route
        params.push({ id: property.id, roomTypeId: '_' })
      }
    }
    
    // Always add a catch-all placeholder to ensure route exists
    params.push({ id: '_', roomTypeId: '_' })
    
    return params
  } catch (error) {
    console.error('Error fetching properties for static generation:', error)
    // Always return at least one route - client component will extract ID from URL
    return [{ id: '_', roomTypeId: '_' }]
  }
}

export default function PropertyRoomDetailPage({ 
  params 
}: { 
  params: { id: string; roomTypeId: string } 
}) {
  // Extract IDs from params, use empty string if placeholder
  const propertyId = params.id === '_' ? '' : params.id
  const roomTypeId = params.roomTypeId === '_' ? '' : params.roomTypeId
  // Client component will extract actual IDs from URL if these are empty
  return <PropertyRoomDetailClient propertyId={propertyId} roomTypeId={roomTypeId} />
}

