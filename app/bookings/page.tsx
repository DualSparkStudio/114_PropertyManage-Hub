"use client"

import { useEffect, useState } from "react"
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
import { getBookingsWithDetails } from "@/lib/supabase/bookings"
import { getAllProperties } from "@/lib/supabase/properties"
import type { BookingWithDetails } from "@/lib/types/database"
import type { Property } from "@/lib/types/database"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsData, propertiesData] = await Promise.all([
          getBookingsWithDetails(),
          getAllProperties(),
        ])
        setBookings(bookingsData)
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Bookings"
          description="Manage all bookings across your properties"
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search bookings..." />
            </div>
            <Input type="date" className="w-full sm:w-[180px]" placeholder="Check-in" />
            <Input type="date" className="w-full sm:w-[180px]" placeholder="Check-out" />
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((prop) => (
                  <SelectItem key={prop.id} value={prop.id}>
                    {prop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookings found.</p>
              </div>
            ) : (
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
                  {bookings.map((booking) => {
                    const property = booking.property as any
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.guest_name}
                        </TableCell>
                        <TableCell>{property?.name || "Unknown"}</TableCell>
                        <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{booking.source}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "success"
                                : booking.status === "pending"
                                ? "warning"
                                : booking.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{booking.amount}</TableCell>
                        <TableCell>
                          <BookingDetailDrawer booking={booking as any}>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </BookingDetailDrawer>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

