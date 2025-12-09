import { PropertyRoomsClient } from "./property-rooms-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default function PropertyRoomsPage({ params }: { params: { id: string } }) {
  return <PropertyRoomsClient propertySlug={params.id} />
}

