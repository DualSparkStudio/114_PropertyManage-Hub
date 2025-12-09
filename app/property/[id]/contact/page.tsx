import { PropertyContactClient } from "./property-contact-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default function PropertyContactPage({ params }: { params: { id: string } }) {
  return <PropertyContactClient propertySlug={params.id} />
}

