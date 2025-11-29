import { PropertyContactClient } from "./property-contact-client"

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

export default function PropertyContactPage({ params }: { params: { id: string } }) {
  return <PropertyContactClient propertySlug={params.id} />
}

