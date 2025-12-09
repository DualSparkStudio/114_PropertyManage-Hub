import { PropertyAttractionsClient } from "./property-attractions-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default function PropertyAttractionsPage({ params }: { params: { id: string } }) {
  return <PropertyAttractionsClient propertySlug={params.id} />
}

