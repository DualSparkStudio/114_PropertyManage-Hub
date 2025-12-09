import { PropertyFeaturesClient } from "./property-features-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default function PropertyFeaturesPage({ params }: { params: { id: string } }) {
  return <PropertyFeaturesClient propertySlug={params.id} />
}

