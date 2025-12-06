import { PropertyDetailsClient } from "./property-details-client"

// Generate static params for static export
// Using property slugs from seed data - these match the database
export async function generateStaticParams() {
  // Return property slugs that match the seed data
  // These will be statically generated, but pages will fetch fresh data at runtime
  return [
    { id: '550e8400-e29b-41d4-a716-446655440000' }, // grand-hotel
    { id: '550e8400-e29b-41d4-a716-446655440001' }, // beach-resort
    { id: '550e8400-e29b-41d4-a716-446655440002' }, // mountain-villa
    { id: '550e8400-e29b-41d4-a716-446655440003' }, // city-hotel
    { id: '550e8400-e29b-41d4-a716-446655440004' }, // lakeside-resort
    { id: '550e8400-e29b-41d4-a716-446655440005' }, // desert-oasis
    // Also include slugs for backward compatibility
    { id: 'grand-hotel' },
    { id: 'beach-resort' },
    { id: 'mountain-villa' },
    { id: 'city-hotel' },
    { id: 'lakeside-resort' },
    { id: 'desert-oasis' },
  ]
}

export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const propertyId = params.id
  return <PropertyDetailsClient propertyId={propertyId} />
}
