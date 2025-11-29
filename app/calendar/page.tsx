"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"

const bookings = [
  {
    id: "1",
    guest: "John Doe",
    property: "Grand Hotel",
    checkIn: new Date(2024, 0, 15),
    checkOut: new Date(2024, 0, 18),
    source: "Website",
    color: "#3b82f6",
  },
  {
    id: "2",
    guest: "Jane Smith",
    property: "Beach Resort",
    checkIn: new Date(2024, 0, 16),
    checkOut: new Date(2024, 0, 20),
    source: "Airbnb",
    color: "#ef4444",
  },
  {
    id: "3",
    guest: "Mike Johnson",
    property: "Mountain Villa",
    checkIn: new Date(2024, 0, 17),
    checkOut: new Date(2024, 0, 19),
    source: "Booking.com",
    color: "#10b981",
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(
      (booking) =>
        date >= booking.checkIn && date <= booking.checkOut
    )
  }

  return (
    <MainLayout>
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
                              className="text-xs p-1 rounded text-white"
                              style={{ backgroundColor: booking.color }}
                              title={`${booking.guest} - ${booking.property}`}
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
                              className="text-xs p-2 rounded text-white"
                              style={{ backgroundColor: booking.color }}
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

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#3b82f6" }}
                />
                <span className="text-sm">Website</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <span className="text-sm">Airbnb</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#10b981" }}
                />
                <span className="text-sm">Booking.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#f59e0b" }}
                />
                <span className="text-sm">Walk-in</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

