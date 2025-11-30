"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatsCard } from "@/components/reusable/stats-card"
import {
  Building2,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RevenueChart } from "@/components/reusable/revenue-chart"
import { BookingSourceChart } from "@/components/reusable/booking-source-chart"

export default function AdminDashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your property management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <StatsCard
            title="Total Properties"
            value={12}
            icon={Building2}
            change="+2 this month"
            trend="up"
          />
          <StatsCard
            title="Bookings Today"
            value={8}
            icon={CalendarCheck}
            change="+3 from yesterday"
            trend="up"
          />
          <StatsCard
            title="Occupancy Rate"
            value="87%"
            icon={TrendingUp}
            change="+5% from last month"
            trend="up"
          />
          <StatsCard
            title="Revenue (Month)"
            value="$124,500"
            icon={DollarSign}
            change="+12% from last month"
            trend="up"
          />
          <StatsCard
            title="Pending Check-ins"
            value={5}
            icon={Clock}
            change="2 today"
            trend="up"
          />
          <StatsCard
            title="Pending Check-outs"
            value={3}
            icon={Users}
            change="1 today"
            trend="up"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Booking Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingSourceChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    guest: "John Doe",
                    property: "Grand Hotel",
                    checkIn: "2024-01-15",
                    checkOut: "2024-01-18",
                    status: "Confirmed",
                    source: "Website",
                  },
                  {
                    guest: "Jane Smith",
                    property: "Beach Resort",
                    checkIn: "2024-01-16",
                    checkOut: "2024-01-20",
                    status: "Pending",
                    source: "Airbnb",
                  },
                  {
                    guest: "Mike Johnson",
                    property: "Mountain Villa",
                    checkIn: "2024-01-17",
                    checkOut: "2024-01-19",
                    status: "Confirmed",
                    source: "Booking.com",
                  },
                  {
                    guest: "Sarah Williams",
                    property: "City Hotel",
                    checkIn: "2024-01-18",
                    checkOut: "2024-01-22",
                    status: "Cancelled",
                    source: "Manual",
                  },
                ].map((booking, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{booking.guest}</TableCell>
                    <TableCell>{booking.property}</TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
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
                    <TableCell>{booking.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  guest: "John Doe",
                  property: "Grand Hotel",
                  checkIn: "Today, 2:00 PM",
                  room: "Room 201",
                },
                {
                  guest: "Jane Smith",
                  property: "Beach Resort",
                  checkIn: "Today, 4:00 PM",
                  room: "Room 305",
                },
                {
                  guest: "Mike Johnson",
                  property: "Mountain Villa",
                  checkIn: "Tomorrow, 11:00 AM",
                  room: "Villa A",
                },
              ].map((checkin, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-xl"
                >
                  <div>
                    <p className="font-medium">{checkin.guest}</p>
                    <p className="text-sm text-muted-foreground">
                      {checkin.property} • {checkin.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{checkin.checkIn}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

