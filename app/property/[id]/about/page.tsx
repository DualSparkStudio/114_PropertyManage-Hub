import { PropertyAboutClient } from "./property-about-client"

// Generate static params for static export
// Return empty array to allow dynamic slugs - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default function PropertyAboutPage({ params }: { params: { id: string } }) {
  return <PropertyAboutClient propertySlug={params.id} />
}

