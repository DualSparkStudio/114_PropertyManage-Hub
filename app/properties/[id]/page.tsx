import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/reusable/stats-card"
import { Bed, DollarSign, TrendingUp, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grand Hotel</h1>
          <p className="text-muted-foreground mt-1">New York, USA</p>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
            alt="Grand Hotel"
            fill
            className="object-cover"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Rooms"
            value={120}
            icon={Bed}
            change="12 available"
            trend="up"
          />
          <StatsCard
            title="Occupancy Rate"
            value="92%"
            icon={TrendingUp}
            change="+5% from last month"
            trend="up"
          />
          <StatsCard
            title="Monthly Revenue"
            value="$45,200"
            icon={DollarSign}
            change="+12% from last month"
            trend="up"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">
                    A luxurious hotel located in the heart of New York City,
                    offering world-class amenities and exceptional service.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="mt-1 font-medium">Hotel</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="mt-1 font-medium">New York, USA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rooms</p>
                    <p className="mt-1 font-medium">120</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="success" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New booking received", time: "2 hours ago" },
                    { action: "Room 201 checked out", time: "5 hours ago" },
                    { action: "Maintenance completed", time: "1 day ago" },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-xl"
                    >
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Room List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room No</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { no: "201", type: "Deluxe", status: "Available", price: "$150" },
                      { no: "202", type: "Standard", status: "Occupied", price: "$120" },
                      { no: "203", type: "Suite", status: "Maintenance", price: "$250" },
                      { no: "204", type: "Deluxe", status: "Available", price: "$150" },
                    ].map((room, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{room.no}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              room.status === "Available"
                                ? "success"
                                : room.status === "Occupied"
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{room.price}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Peak Season</TableHead>
                      <TableHead>Off Season</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { type: "Standard", base: "$120", peak: "$180", off: "$100" },
                      { type: "Deluxe", base: "$150", peak: "$220", off: "$130" },
                      { type: "Suite", base: "$250", peak: "$350", off: "$200" },
                    ].map((pricing, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{pricing.type}</TableCell>
                        <TableCell>{pricing.base}</TableCell>
                        <TableCell>{pricing.peak}</TableCell>
                        <TableCell>{pricing.off}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Wi-Fi",
                    "Swimming Pool",
                    "Gym",
                    "Spa",
                    "Restaurant",
                    "Parking",
                    "Room Service",
                    "Laundry",
                    "Business Center",
                  ].map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 border rounded-xl"
                    >
                      <Badge variant="secondary">{amenity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gallery</CardTitle>
                  <Button>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Add Images
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="relative h-32 w-full rounded-xl overflow-hidden"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&sig=${i}`}
                        alt={`Gallery ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        guest: "John Doe",
                        checkIn: "2024-01-15",
                        checkOut: "2024-01-18",
                        status: "Confirmed",
                        amount: "$450",
                      },
                      {
                        guest: "Jane Smith",
                        checkIn: "2024-01-20",
                        checkOut: "2024-01-25",
                        status: "Pending",
                        amount: "$600",
                      },
                    ].map((booking, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {booking.guest}
                        </TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "Confirmed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

