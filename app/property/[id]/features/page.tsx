import { PropertyFeaturesClient } from "./property-features-client"

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

export default function PropertyFeaturesPage({ params }: { params: { id: string } }) {
  return <PropertyFeaturesClient propertySlug={params.id} />
}

