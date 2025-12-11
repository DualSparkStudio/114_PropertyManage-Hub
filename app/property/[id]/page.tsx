import { PropertyHomeClient } from "./property-home-client"
import { getAllProperties } from "@/lib/supabase/properties"

// Generate static params for static export
// IMPORTANT: With static export, pages are generated at BUILD TIME
// The Supabase client may not work during build, so we return a generic placeholder
// The client component will extract the property ID from the URL and fetch data
export async function generateStaticParams() {
  try {
    // Try to fetch all properties from database at build time
    // Note: This may fail if Supabase env vars aren't available during build
    const properties = await getAllProperties()
    console.log(`[generateStaticParams] Found ${properties.length} properties to generate`)
    
    if (properties.length === 0) {
      console.warn('[generateStaticParams] No properties found, returning generic placeholder')
      // Return a generic placeholder that will match any property ID
      // The client component will extract the actual ID from the URL
      return [{ id: '_' }]
    }
    
    // Return all property IDs for static generation
    return properties.map((property) => ({
      id: property.id,
    }))
  } catch (error) {
    console.error('[generateStaticParams] Error fetching properties (this is OK during build):', error)
    // Return a generic placeholder that will work for any property ID
    // The client component will extract the ID from the URL
    return [{ id: '_' }]
  }
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  // If the ID is '_' (placeholder), the client component will extract it from the URL
  const propertyId = params.id === '_' ? '' : params.id
  return <PropertyHomeClient propertyId={propertyId} />
}

