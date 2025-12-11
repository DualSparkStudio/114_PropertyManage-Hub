import { PropertyFeaturesClient } from "./property-features-client"
import { getAllProperties } from "@/lib/supabase/properties"

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties()
    if (properties.length === 0) {
      return [{ id: '_' }]
    }
    return properties.map((property) => ({ id: property.id }))
  } catch (error) {
    console.error('Error fetching properties for static generation:', error)
    return [{ id: '_' }]
  }
}

export default function PropertyFeaturesPage({ params }: { params: { id: string } }) {
  const propertyId = params.id === '_' ? '' : params.id
  return <PropertyFeaturesClient propertyId={propertyId} />
}

