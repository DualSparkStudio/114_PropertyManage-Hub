import { PropertyHomeClient } from "./property-home-client"

// Generate static params for static export
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

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyHomeClient propertySlug={params.id} />
}
