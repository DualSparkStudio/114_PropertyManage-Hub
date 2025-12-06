import { PropertyDetailsClient } from "./property-details-client"

// Generate static params for static export (will be empty, pages load dynamically)
export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand
  return []
}

export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const propertyId = params.id
  return <PropertyDetailsClient propertyId={propertyId} />
}
