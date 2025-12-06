import { PropertyDetailsClient } from "./property-details-client"

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
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
