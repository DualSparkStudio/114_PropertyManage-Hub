import { PropertyHomeClient } from "./property-home-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  // Return empty array to allow any slug to work dynamically
  // The client component will fetch by slug and handle 404s if property doesn't exist
  return []
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  // Pass the slug directly without validation - let the client component handle it
  // The client will fetch by slug and show appropriate error if property doesn't exist
  return <PropertyHomeClient propertySlug={params.id} />
}
