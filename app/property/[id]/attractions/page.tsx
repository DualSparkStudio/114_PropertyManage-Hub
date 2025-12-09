import { PropertyAttractionsClient } from "./property-attractions-client"

export async function generateStaticParams() {
  return [
    { id: '550e8400-e29b-41d4-a716-446655440000' },
    { id: '550e8400-e29b-41d4-a716-446655440001' },
    { id: '550e8400-e29b-41d4-a716-446655440002' },
    { id: '550e8400-e29b-41d4-a716-446655440003' },
    { id: '550e8400-e29b-41d4-a716-446655440004' },
    { id: '550e8400-e29b-41d4-a716-446655440005' },
  ]
}

export default function PropertyAttractionsPage({ params }: { params: { id: string } }) {
  return <PropertyAttractionsClient propertyId={params.id} />
}

