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
import { getAllRooms } from "@/lib/supabase/rooms"
import { getAllProperties } from "@/lib/supabase/properties"
import type { Room } from "@/lib/types/database"
import type { Property } from "@/lib/types/database"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<(Room & { property_name?: string; room_type_name?: string })[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsData, propertiesData] = await Promise.all([
          getAllRooms(),
          getAllProperties(),
        ])
        setRooms(roomsData)
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching rooms:", error)
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
          title="Rooms"
          description="Manage all rooms across properties"
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search rooms..." />
            </div>
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Cleanliness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="dirty">Dirty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Rooms Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No rooms found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room No</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.property_name || "Unknown"}</TableCell>
                      <TableCell>{room.room_type_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            room.status === "available"
                              ? "success"
                              : room.status === "occupied"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

