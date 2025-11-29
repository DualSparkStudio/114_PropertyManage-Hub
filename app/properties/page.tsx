import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { PropertyCard } from "@/components/reusable/property-card"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

const properties = [
  {
    id: "1",
    name: "Grand Hotel",
    type: "Hotel",
    location: "New York, USA",
    rooms: 120,
    occupancy: 92,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    id: "2",
    name: "Beach Resort",
    type: "Resort",
    location: "Miami, USA",
    rooms: 85,
    occupancy: 78,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
  },
  {
    id: "3",
    name: "Mountain Villa",
    type: "Villa",
    location: "Aspen, USA",
    rooms: 12,
    occupancy: 65,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  },
  {
    id: "4",
    name: "City Hotel",
    type: "Hotel",
    location: "San Francisco, USA",
    rooms: 200,
    occupancy: 88,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  },
  {
    id: "5",
    name: "Lakeside Resort",
    type: "Resort",
    location: "Lake Tahoe, USA",
    rooms: 95,
    occupancy: 72,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  },
  {
    id: "6",
    name: "Desert Oasis",
    type: "Resort",
    location: "Phoenix, USA",
    rooms: 150,
    occupancy: 81,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
]

export default function PropertiesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Properties"
          description="Manage all your properties from one place"
          action={{
            label: "Add New Property",
            onClick: () => {},
            icon: Plus,
          }}
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search properties..." />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="resort">Resort</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Properties Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

