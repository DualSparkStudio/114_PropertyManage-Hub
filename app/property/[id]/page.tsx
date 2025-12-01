import { PropertyHomeClient } from "./property-home-client"

// Generate static params for static export
export async function generateStaticParams() {
  // Only return valid property slugs to prevent routing conflicts
  const validSlugs = [
    'grand-hotel',
    'beach-resort',
    'mountain-villa',
    'city-hotel',
    'lakeside-resort',
    'desert-oasis',
  ]
  
  return validSlugs.map((slug) => ({ id: slug }))
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  // Validate that the slug is a valid property slug
  const validSlugs = ['grand-hotel', 'beach-resort', 'mountain-villa', 'city-hotel', 'lakeside-resort', 'desert-oasis']
  const slug = validSlugs.includes(params.id) ? params.id : 'grand-hotel'
  
  return <PropertyHomeClient propertySlug={slug} />
}
