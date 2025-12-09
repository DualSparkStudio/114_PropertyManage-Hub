import { PropertyAttractionsClient } from "../[id]/attractions/property-attractions-client"

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

export default function PropertyAttractionsPageCatchAll({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  const propertySlug = params.slug?.[0] || ''
  return <PropertyAttractionsClient propertySlug={propertySlug} />
}

