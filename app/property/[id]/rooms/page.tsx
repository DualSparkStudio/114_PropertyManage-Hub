import { PropertyRoomsClient } from "./property-rooms-client"

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

export default function PropertyRoomsPage({ params }: { params: { id: string } }) {
  return <PropertyRoomsClient propertySlug={params.id} />
}

