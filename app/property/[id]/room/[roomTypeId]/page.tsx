import { PropertyRoomDetailClient } from "./property-room-detail-client"
import { getAllProperties } from "@/lib/supabase/properties"

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties()
    if (properties.length === 0) {
      return [{ id: '_', roomTypeId: '_' }]
    }
    // For now, return placeholder - client component will handle dynamic loading
    return [{ id: '_', roomTypeId: '_' }]
  } catch (error) {
    console.error('Error fetching properties for static generation:', error)
    return [{ id: '_', roomTypeId: '_' }]
  }
}

export default function PropertyRoomDetailPage({ 
  params 
}: { 
  params: { id: string; roomTypeId: string } 
}) {
  const propertyId = params.id === '_' ? '' : params.id
  const roomTypeId = params.roomTypeId === '_' ? '' : params.roomTypeId
  return <PropertyRoomDetailClient propertyId={propertyId} roomTypeId={roomTypeId} />
}

