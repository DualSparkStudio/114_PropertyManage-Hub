import { PropertyHomeClient } from "./property-home-client"
import { getAllProperties } from "@/lib/supabase/properties"

// Generate static params for static export using property IDs
// Since we're using static export, we need to fetch all properties at build time
export async function generateStaticParams() {
  try {
    // Fetch all properties from database
    const properties = await getAllProperties()
    // Return all property IDs for static generation
    return properties.map((property) => ({
      id: property.id,
    }))
  } catch (error) {
    console.error('Error fetching properties for static generation:', error)
    // Fallback to seed data IDs if database fetch fails
    return [
      { id: '550e8400-e29b-41d4-a716-446655440000' }, // grand-hotel
      { id: '550e8400-e29b-41d4-a716-446655440001' }, // beach-resort
      { id: '550e8400-e29b-41d4-a716-446655440002' }, // mountain-villa
      { id: '550e8400-e29b-41d4-a716-446655440003' }, // city-hotel
      { id: '550e8400-e29b-41d4-a716-446655440004' }, // lakeside-resort
      { id: '550e8400-e29b-41d4-a716-446655440005' }, // desert-oasis
    ]
  }
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyHomeClient propertyId={params.id} />
}

