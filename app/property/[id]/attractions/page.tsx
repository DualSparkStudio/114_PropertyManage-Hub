import { PropertyAttractionsClient } from "./property-attractions-client"

export async function generateStaticParams() {
  return [
    { id: 'grand-hotel' },
    { id: 'beach-resort' },
    { id: 'mountain-villa' },
    { id: 'city-hotel' },
    { id: 'lakeside-resort' },
    { id: 'desert-oasis' },
  ]
}

export default function PropertyAttractionsPage({ params }: { params: { id: string } }) {
  return <PropertyAttractionsClient propertySlug={params.id} />
}

