"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Breadcrumb } from "@/components/ui/breadcrumb"
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
import { getAllProperties } from "@/lib/supabase/properties"
import { getAllBookings, getBookingsWithDetails, calculateOccupancy } from "@/lib/supabase/bookings"
import { supabase } from "@/lib/supabase/client"
import { format } from "date-fns"

interface DashboardStats {
  totalProperties: number
  totalRooms: number
  bookingsToday: number
  occupancyRate: number
  monthlyRevenue: number
  pendingCheckIns: number
  pendingCheckOuts: number
  bookingsTodayChange: string
  occupancyChange: string
  revenueChange: string
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalRooms: 0,
    bookingsToday: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    pendingCheckIns: 0,
    pendingCheckOuts: 0,
    bookingsTodayChange: "0",
    occupancyChange: "0%",
    revenueChange: "0%",
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all properties
        const properties = await getAllProperties()
        const totalProperties = properties.length

        // Fetch all bookings
        const allBookings = await getAllBookings()
        const bookingsWithDetails = await getBookingsWithDetails()

        // Get today's date
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // Calculate bookings today
        const bookingsToday = allBookings.filter(
          (b) => b.check_in === today || b.check_out === today
        ).length
        const bookingsYesterday = allBookings.filter(
          (b) => b.check_in === yesterdayStr || b.check_out === yesterdayStr
        ).length
        const bookingsTodayChange = bookingsYesterday > 0 
          ? `${bookingsToday >= bookingsYesterday ? '+' : ''}${bookingsToday - bookingsYesterday} from yesterday`
          : `${bookingsToday} today`

        // Calculate pending check-ins (check-in date is today or in the next 7 days)
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        const nextWeekStr = nextWeek.toISOString().split('T')[0]
        const pendingCheckIns = allBookings.filter(
          (b) => b.status === 'confirmed' && b.check_in >= today && b.check_in <= nextWeekStr
        ).length

        // Calculate pending check-outs (check-out date is today or in the next 7 days)
        const pendingCheckOuts = allBookings.filter(
          (b) => b.status === 'confirmed' && b.check_out >= today && b.check_out <= nextWeekStr
        ).length

        // Calculate monthly revenue
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]

        const monthlyBookings = allBookings.filter(
          (b) => b.status === 'confirmed' && b.check_in >= firstDayOfMonth && b.check_in <= lastDayOfMonth
        )
        const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0)

        const lastMonthBookings = allBookings.filter(
          (b) => b.status === 'confirmed' && b.check_in >= firstDayLastMonth && b.check_in <= lastDayLastMonth
        )
        const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0)
        const revenueChange = lastMonthRevenue > 0
          ? `${((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(0)}% from last month`
          : "New this month"

        // Calculate overall occupancy rate
        let totalRooms = 0
        let occupiedRooms = 0

        for (const property of properties) {
          // Get room types for this property
          const { data: roomTypes } = await supabase
            .from('room_types')
            .select('number_of_rooms')
            .eq('property_id', property.id)

          const propertyRooms = roomTypes?.reduce((sum, rt) => sum + (rt.number_of_rooms || 1), 0) || 0
          totalRooms += propertyRooms

          // Calculate occupied rooms for today
          const occupancy = await calculateOccupancy(property.id, propertyRooms)
          occupiedRooms += Math.round((occupancy / 100) * propertyRooms)
        }

        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

        // Calculate occupancy change (simplified - compare with previous month average)
        // For now, just show current occupancy
        const occupancyChange = `${occupancyRate}% occupancy`

        setStats({
          totalProperties,
          totalRooms,
          bookingsToday,
          occupancyRate,
          monthlyRevenue,
          pendingCheckIns,
          pendingCheckOuts,
          bookingsTodayChange,
          occupancyChange,
          revenueChange,
        })

        // Get recent bookings (last 10) - only if there are bookings
        if (allBookings.length > 0) {
          const recent = bookingsWithDetails
            .slice(0, 10)
            .map((booking: any) => ({
              id: booking.id,
              guest: booking.guest_name || 'Guest',
              property: booking.property?.name || 'Unknown Property',
              checkIn: booking.check_in,
              checkOut: booking.check_out,
              status: booking.status,
              source: booking.source || 'Manual',
            }))
          setRecentBookings(recent)
        } else {
          setRecentBookings([])
        }

        // Get upcoming check-ins (next 7 days)
        const upcoming = bookingsWithDetails
          .filter((b: any) => {
            const checkInDate = new Date(b.check_in + 'T00:00:00')
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextWeek = new Date()
            nextWeek.setDate(nextWeek.getDate() + 7)
            nextWeek.setHours(23, 59, 59, 999)
            return checkInDate >= today && checkInDate <= nextWeek && b.status === 'confirmed'
          })
          .sort((a: any, b: any) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
          .slice(0, 5)
          .map((booking: any) => {
            const checkInDate = new Date(booking.check_in + 'T00:00:00')
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(0, 0, 0, 0)

            let checkInTime = ""
            if (checkInDate.toDateString() === today.toDateString()) {
              checkInTime = "Today"
            } else if (checkInDate.toDateString() === tomorrow.toDateString()) {
              checkInTime = "Tomorrow"
            } else {
              checkInTime = format(checkInDate, 'MMM d, yyyy')
            }

            return {
              id: booking.id,
              guest: booking.guest_name || 'Guest',
              property: booking.property?.name || 'Unknown Property',
              checkIn: checkInTime,
              room: booking.room_type?.name || booking.room?.name || 'Room',
            }
          })
        setUpcomingCheckIns(upcoming)

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Admin" },
          ]}
        />
      </div>
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
            value={stats.totalProperties}
            icon={Building2}
            change={`${stats.totalProperties} properties, ${stats.totalRooms} rooms`}
          />
          <StatsCard
            title="Bookings Today"
            value={stats.bookingsToday}
            icon={CalendarCheck}
            change={stats.bookingsTodayChange}
            trend={stats.bookingsToday > 0 ? "up" : undefined}
          />
          <StatsCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            icon={TrendingUp}
            change={stats.occupancyChange}
            trend={stats.occupancyRate > 50 ? "up" : stats.occupancyRate > 0 ? undefined : "down"}
          />
          <StatsCard
            title="Revenue (Month)"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={stats.revenueChange}
            trend={stats.monthlyRevenue > 0 ? "up" : undefined}
          />
          <StatsCard
            title="Pending Check-ins"
            value={stats.pendingCheckIns}
            icon={Clock}
            change={`${stats.pendingCheckIns} upcoming`}
            trend={stats.pendingCheckIns > 0 ? "up" : undefined}
          />
          <StatsCard
            title="Pending Check-outs"
            value={stats.pendingCheckOuts}
            icon={Users}
            change={`${stats.pendingCheckOuts} upcoming`}
            trend={stats.pendingCheckOuts > 0 ? "up" : undefined}
          />
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.guest}</TableCell>
                      <TableCell>{booking.property}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
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
              {upcomingCheckIns.length > 0 ? (
                upcomingCheckIns.map((checkin) => (
                  <div
                    key={checkin.id}
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
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming check-ins
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

