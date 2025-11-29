import { PropertyAboutClient } from "./property-about-client"

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

export default function PropertyAboutPage({ params }: { params: { id: string } }) {
  return <PropertyAboutClient propertySlug={params.id} />
}

