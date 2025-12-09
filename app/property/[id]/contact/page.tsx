import { PropertyContactClient } from "./property-contact-client"

// Generate static params for static export
// Return slugs from seed data to satisfy Next.js static export requirement
// The client component will fetch by the actual slug from params (works with any slug)
export async function generateStaticParams() {
  // Return all slugs from seed data - these pages will be generated at build time
  // Client component handles fetching by actual slug from URL params
  return [
    { id: 'grand-hotel' },
    { id: 'beach-resort' },
    { id: 'mountain-villa' },
    { id: 'city-hotel' },
    { id: 'lakeside-resort' },
    { id: 'desert-oasis' },
  ]
}

export default function PropertyContactPage({ params }: { params: { id: string } }) {
  return <PropertyContactClient propertySlug={params.id} />
}

