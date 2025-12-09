import { PropertyHomeClient } from "./property-home-client"

// Generate static params for static export using property IDs
export async function generateStaticParams() {
  // Return property IDs from seed data
  // These will be statically generated
  return [
    { id: '550e8400-e29b-41d4-a716-446655440000' }, // grand-hotel
    { id: '550e8400-e29b-41d4-a716-446655440001' }, // beach-resort
    { id: '550e8400-e29b-41d4-a716-446655440002' }, // mountain-villa
    { id: '550e8400-e29b-41d4-a716-446655440003' }, // city-hotel
    { id: '550e8400-e29b-41d4-a716-446655440004' }, // lakeside-resort
    { id: '550e8400-e29b-41d4-a716-446655440005' }, // desert-oasis
  ]
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyHomeClient propertyId={params.id} />
}

