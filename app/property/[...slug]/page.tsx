import { PropertyHomeClient } from "../[id]/property-home-client"

// Catch-all route to handle any property slug dynamically
// This ensures that even if a property slug changes, the page will still work
export async function generateStaticParams() {
  // Return slugs from seed data in catch-all format
  // The client component will fetch by the actual slug from URL params
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

export default function PropertyPageCatchAll({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  // Extract slug from catch-all params
  // slug will be an array like ['grand-hotel'] or ['luxury-grand-hotel']
  const propertySlug = params.slug?.[0] || ''
  
  return <PropertyHomeClient propertySlug={propertySlug} />
}

