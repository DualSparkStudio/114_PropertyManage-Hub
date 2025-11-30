"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { BookingDetailDrawer } from "@/components/reusable/booking-detail-drawer"

const bookings = [
  {
    id: "1",
    guest: "John Doe",
    property: "Grand Hotel",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    source: "Website",
    status: "Confirmed",
    amount: "$450",
  },
  {
    id: "2",
    guest: "Jane Smith",
    property: "Beach Resort",
    checkIn: "2024-01-16",
    checkOut: "2024-01-20",
    source: "Airbnb",
    status: "Pending",
    amount: "$600",
  },
  {
    id: "3",
    guest: "Mike Johnson",
    property: "Mountain Villa",
    checkIn: "2024-01-17",
    checkOut: "2024-01-19",
    source: "Booking.com",
    status: "Confirmed",
    amount: "$380",
  },
  {
    id: "4",
    guest: "Sarah Williams",
    property: "City Hotel",
    checkIn: "2024-01-18",
    checkOut: "2024-01-22",
    source: "Manual",
    status: "Cancelled",
    amount: "$720",
  },
  {
    id: "5",
    guest: "David Brown",
    property: "Lakeside Resort",
    checkIn: "2024-01-19",
    checkOut: "2024-01-21",
    source: "Website",
    status: "Confirmed",
    amount: "$400",
  },
]

export default function BookingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Bookings"
          description="Manage all bookings across your properties"
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search bookings..." />
            </div>
            <Input type="date" className="w-[180px]" placeholder="Check-in" />
            <Input type="date" className="w-[180px]" placeholder="Check-out" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="1">Grand Hotel</SelectItem>
                <SelectItem value="2">Beach Resort</SelectItem>
                <SelectItem value="3">Mountain Villa</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="booking">Booking.com</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.guest}
                    </TableCell>
                    <TableCell>{booking.property}</TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>{booking.source}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "Confirmed"
                            ? "success"
                            : booking.status === "Pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{booking.amount}</TableCell>
                    <TableCell>
                      <BookingDetailDrawer booking={booking}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </BookingDetailDrawer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

