import { PropertyHomeClient } from "../[id]/property-home-client"
import { PropertyRoomsClient } from "../[id]/rooms/property-rooms-client"
import { PropertyAttractionsClient } from "../[id]/attractions/property-attractions-client"
import { PropertyFeaturesClient } from "../[id]/features/property-features-client"
import { PropertyAboutClient } from "../[id]/about/property-about-client"
import { PropertyContactClient } from "../[id]/contact/property-contact-client"

// Catch-all route to handle any property slug and sub-routes dynamically
// This ensures that even if a property slug changes, the page will still work
export async function generateStaticParams() {
  // Return slugs from seed data in catch-all format
  // Include both main pages and sub-routes
  const seedSlugs = [
    'grand-hotel',
    'beach-resort',
    'mountain-villa',
    'city-hotel',
    'lakeside-resort',
    'desert-oasis',
  ]
  
  const subRoutes = ['rooms', 'attractions', 'features', 'about', 'contact']
  
  // Generate params for main pages and all sub-routes
  const params: Array<{ slug: string[] }> = []
  
  // Main property pages
  seedSlugs.forEach((slug) => {
    params.push({ slug: [slug] })
  })
  
  // Sub-routes for each property
  seedSlugs.forEach((slug) => {
    subRoutes.forEach((subRoute) => {
      params.push({ slug: [slug, subRoute] })
    })
  })
  
  return params
}

export default function PropertyPageCatchAll({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  // Extract slug and sub-route from catch-all params
  // slug will be an array like:
  // ['grand-hotel'] for home page
  // ['grand-hotel', 'rooms'] for rooms page
  // etc.
  const propertySlug = params.slug?.[0] || ''
  const subRoute = params.slug?.[1] || ''
  
  // Route to appropriate component based on sub-route
  switch (subRoute) {
    case 'rooms':
      return <PropertyRoomsClient propertySlug={propertySlug} />
    case 'attractions':
      return <PropertyAttractionsClient propertySlug={propertySlug} />
    case 'features':
      return <PropertyFeaturesClient propertySlug={propertySlug} />
    case 'about':
      return <PropertyAboutClient propertySlug={propertySlug} />
    case 'contact':
      return <PropertyContactClient propertySlug={propertySlug} />
    default:
      // Home page (no sub-route)
      return <PropertyHomeClient propertySlug={propertySlug} />
  }
}

