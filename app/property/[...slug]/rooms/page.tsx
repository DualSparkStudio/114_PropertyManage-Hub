import { PropertyRoomsClient } from "../[id]/rooms/property-rooms-client"

// Catch-all route to handle any property slug dynamically
export async function generateStaticParams() {
  const seedSlugs = [
    'grand-hotel',
    'beach-resort',
    'mountain-villa',
    'city-hotel',
    'lakeside-resort',
    'desert-oasis',
  ]
  
  return seedSlugs.map((slug) => ({ slug: [slug] }))
}

export default function PropertyRoomsPageCatchAll({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  const propertySlug = params.slug?.[0] || ''
  return <PropertyRoomsClient propertySlug={propertySlug} />
}

