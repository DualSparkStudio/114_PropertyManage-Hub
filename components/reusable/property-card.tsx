import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PropertyCardProps {
  id: string
  name: string
  type: string
  location: string
  rooms: number
  occupancy: number
  image: string
}

export function PropertyCard({
  id,
  name,
  type,
  location,
  rooms,
  occupancy,
  image,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90">
            {type}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{rooms} Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{occupancy}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/properties/${id}`}>View Property</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

