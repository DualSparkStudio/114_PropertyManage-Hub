"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns"
import { getBookingsWithDetails, getAllProperties, getPropertyRoomTypes, checkPropertyAvailability } from "@/lib/data/mock-data-helpers"
import type { BookingWithDetails } from "@/lib/types/database"
import type { Property } from "@/lib/types/database"

interface CalendarBooking {
  id: string
  guest: string
  property: string
  propertyId: string
  checkIn: Date
  checkOut: Date
  source: string
  color: string
  status: string
}

const sourceColors: Record<string, string> = {
  website: "#3b82f6",
  airbnb: "#ef4444",
  "booking.com": "#10b981",
  makemytrip: "#f59e0b",
  goibibo: "#8b5cf6",
  manual: "#6b7280",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, { isAvailable: boolean; availableRooms: number; totalRooms: number }>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsData, propertiesData] = await Promise.all([
          getBookingsWithDetails(),
          getAllProperties(),
        ])

        setProperties(propertiesData)

        // Transform bookings for calendar display
        const calendarBookings: CalendarBooking[] = bookingsData
          .filter((b: any) => b.status === "confirmed" || b.status === "pending")
          .map((booking: any) => {
            return {
              id: booking.id,
              guest: booking.guest_name,
              property: booking.property_name || "Unknown",
              propertyId: booking.property_id,
              checkIn: parseISO(booking.check_in),
              checkOut: parseISO(booking.check_out),
              source: "website",
              color: "#3b82f6",
              status: booking.status,
            }
          })

        setBookings(calendarBookings)

        // Check availability for each property for today
        const today = new Date().toISOString().split("T")[0]
        const availabilityMap: Record<string, { isAvailable: boolean; availableRooms: number; totalRooms: number }> = {}
        
        for (const property of propertiesData) {
          try {
            const availability = await checkPropertyAvailability(property.id, today, today)
            availabilityMap[property.id] = availability
          } catch (error) {
            console.error(`Error checking availability for ${property.name}:`, error)
          }
        }
        
        setAvailabilityStatus(availabilityMap)
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      checkIn.setHours(0, 0, 0, 0)
      checkOut.setHours(0, 0, 0, 0)
      const currentDate = new Date(date)
      currentDate.setHours(0, 0, 0, 0)
      
      // Date is within booking range (inclusive check-in, exclusive check-out)
      return currentDate >= checkIn && currentDate < checkOut
    })
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Calendar" },
          ]}
        />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  view === "month"
                    ? subWeeks(currentDate, 4)
                    : subWeeks(currentDate, 1)
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  view === "month"
                    ? addWeeks(currentDate, 4)
                    : addWeeks(currentDate, 1)
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>

          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center font-medium text-sm p-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {monthDays.map((day) => {
                    const dayBookings = getBookingsForDate(day)
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[100px] p-2 border rounded-xl ${
                          isSameMonth(day, currentDate)
                            ? "bg-white"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(day, "d")}
                        </div>
                        <div className="space-y-1">
                          {dayBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: booking.color }}
                              title={`${booking.guest} - ${booking.property} (${booking.source}) - ${booking.status}`}
                            >
                              {booking.guest}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Week of {format(weekStart, "MMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const dayBookings = getBookingsForDate(day)
                    return (
                      <div key={day.toISOString()} className="space-y-2">
                        <div className="text-center font-medium p-2 border-b">
                          {format(day, "EEE d")}
                        </div>
                        <div className="space-y-1 min-h-[200px]">
                          {dayBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="text-xs p-2 rounded text-white cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: booking.color }}
                              title={`${booking.source} - ${booking.status}`}
                            >
                              <div className="font-medium">{booking.guest}</div>
                              <div className="text-xs opacity-90">
                                {booking.property}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="day" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {format(currentDate, "EEEE, MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getBookingsForDate(currentDate).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl border-l-4"
                      style={{ borderLeftColor: booking.color }}
                    >
                      <div className="font-medium">{booking.guest}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.property}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(booking.checkIn, "MMM d")} -{" "}
                        {format(booking.checkOut, "MMM d")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Property Availability Status */}
        {loading ? null : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Property Availability Status (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {properties.map((property) => {
                  const availability = availabilityStatus[property.id]
                  if (!availability) return null
                  
                  const isFullyBooked = !availability.isAvailable && availability.totalRooms > 0
                  
                  return (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{property.name}</span>
                        {isFullyBooked && (
                          <Badge variant="destructive">All Rooms Sold</Badge>
                        )}
                        {!isFullyBooked && availability.totalRooms > 0 && (
                          <Badge variant="success">
                            {availability.availableRooms} of {availability.totalRooms} Available
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {availability.totalRooms === 0 ? "No rooms configured" : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

