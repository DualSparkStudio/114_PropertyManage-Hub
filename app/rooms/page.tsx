"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Breadcrumb } from "@/components/ui/breadcrumb"
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
import { Edit, Eye, Trash2 } from "lucide-react"
import { getAllRooms, updateRoom, createRoom, deleteRoom } from "@/lib/supabase/rooms"
import { useRouter } from "next/navigation"
import { getAllProperties, getAllRoomTypes } from "@/lib/supabase/properties"
import type { Room } from "@/lib/types/database"
import type { Property, RoomType } from "@/lib/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RoomDisplay {
  id: string
  room_number: string
  property_id: string
  property_name: string
  room_type_id: string
  room_type_name: string
  status: string
  isFromRoomTypes: boolean
}

export default function RoomsPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<RoomDisplay[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRoom, setEditingRoom] = useState<RoomDisplay | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editStatus, setEditStatus] = useState<string>("available")
  const [viewingRoom, setViewingRoom] = useState<RoomDisplay | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deletingRoom, setDeletingRoom] = useState<RoomDisplay | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsData, propertiesData, roomTypesData] = await Promise.all([
          getAllRooms(),
          getAllProperties(),
          getAllRoomTypes(),
        ])
        setProperties(propertiesData)
        
        // Create a map of property names
        const propertyMap = new Map(propertiesData.map(p => [p.id, p.name]))
        
        // Combine actual rooms from database with rooms generated from room types
        const actualRooms: RoomDisplay[] = roomsData.map((room: any) => ({
          id: room.id,
          room_number: room.room_number,
          property_id: room.property_id,
          property_name: room.property_name || propertyMap.get(room.property_id) || 'Unknown',
          room_type_id: room.room_type_id || '',
          room_type_name: room.room_type_name || 'N/A',
          status: room.status || 'available',
          isFromRoomTypes: false,
        }))
        
        // Generate ALL rooms from room types based on number_of_rooms
        const generatedRooms: RoomDisplay[] = []
        roomTypesData.forEach((roomType: RoomType & { property_name?: string; property_id?: string }) => {
          const numRooms = roomType.number_of_rooms || 1
          const propertyName = roomType.property_name || propertyMap.get(roomType.property_id || '') || 'Unknown'
          
          // Generate all rooms for this room type
          for (let i = 0; i < numRooms; i++) {
            generatedRooms.push({
              id: `generated-${roomType.id}-${i}`,
              room_number: `${roomType.name} ${i + 1}`,
              property_id: roomType.property_id || '',
              property_name: propertyName,
              room_type_id: roomType.id,
              room_type_name: roomType.name,
              status: 'available',
              isFromRoomTypes: true,
            })
          }
        })
        
        // Combine actual rooms and generated rooms (prioritize actual rooms if they exist)
        const roomMap = new Map<string, RoomDisplay>()
        
        // First add all generated rooms from room types
        generatedRooms.forEach(room => {
          roomMap.set(`${room.room_type_id}-${room.room_number}`, room)
        })
        
        // Then override with actual individual rooms if they exist
        actualRooms.forEach(room => {
          roomMap.set(`${room.room_type_id}-${room.room_number}`, room)
        })
        
        setRooms(Array.from(roomMap.values()))
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
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Rooms" },
          ]}
        />
      </div>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.property_name}</TableCell>
                      <TableCell>{room.room_type_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            room.status === "available"
                              ? "default"
                              : room.status === "occupied"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setViewingRoom(room)
                              setViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (room.isFromRoomTypes) {
                                // For auto-generated rooms, create an actual room record first
                                try {
                                  const newRoom = await createRoom({
                                    property_id: room.property_id,
                                    room_type_id: room.room_type_id,
                                    room_number: room.room_number,
                                    status: room.status as any,
                                  })
                                  // Update the room in the list to mark it as no longer auto-generated
                                  setRooms(rooms.map(r => 
                                    r.id === room.id ? { ...r, id: newRoom.id, isFromRoomTypes: false } : r
                                  ))
                                  setEditingRoom({ ...room, id: newRoom.id, isFromRoomTypes: false })
                                  setEditStatus(room.status)
                                  setEditDialogOpen(true)
                                } catch (error) {
                                  console.error("Error creating room:", error)
                                  alert("Failed to create room. Please try again.")
                                }
                              } else {
                                setEditingRoom(room)
                                setEditStatus(room.status)
                                setEditDialogOpen(true)
                              }
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingRoom(room)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the status of {editingRoom?.room_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setEditingRoom(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (editingRoom) {
                  try {
                    await updateRoom(editingRoom.id, { status: editStatus as any })
                    // Update local state
                    setRooms(rooms.map(r => 
                      r.id === editingRoom.id ? { ...r, status: editStatus } : r
                    ))
                    setEditDialogOpen(false)
                    setEditingRoom(null)
                  } catch (error) {
                    console.error("Error updating room:", error)
                    alert("Failed to update room. Please try again.")
                  }
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Room Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>
              View details for {viewingRoom?.room_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Room Number</label>
              <p className="text-sm font-medium mt-1">{viewingRoom?.room_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Property</label>
              <p className="text-sm font-medium mt-1">{viewingRoom?.property_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Room Type</label>
              <p className="text-sm font-medium mt-1">{viewingRoom?.room_type_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge
                  variant={
                    viewingRoom?.status === "available"
                      ? "default"
                      : viewingRoom?.status === "occupied"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {viewingRoom?.status ? (viewingRoom.status.charAt(0).toUpperCase() + viewingRoom.status.slice(1)) : 'Unknown'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-sm font-medium mt-1">
                {viewingRoom?.isFromRoomTypes ? "Auto-generated from Room Type" : "Individual Room"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewDialogOpen(false)
                setViewingRoom(null)
              }}
            >
              Close
            </Button>
            {viewingRoom?.property_id && (
              <Button
                onClick={() => {
                  router.push(`/properties/${viewingRoom.property_id}`)
                }}
              >
                View Property
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingRoom?.isFromRoomTypes ? (
                <>
                  This is an auto-generated room from a room type. To remove it, you need to edit the room type and reduce the number of rooms.
                  <br /><br />
                  Would you like to navigate to the property to edit the room type?
                </>
              ) : (
                <>
                  Are you sure you want to delete {deletingRoom?.room_number}? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false)
              setDeletingRoom(null)
            }}>
              Cancel
            </AlertDialogCancel>
            {deletingRoom?.isFromRoomTypes ? (
              <AlertDialogAction
                onClick={() => {
                  if (deletingRoom?.property_id) {
                    router.push(`/properties/${deletingRoom.property_id}`)
                  }
                  setDeleteDialogOpen(false)
                  setDeletingRoom(null)
                }}
              >
                Go to Property
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={async () => {
                  if (deletingRoom) {
                    try {
                      await deleteRoom(deletingRoom.id)
                      setRooms(rooms.filter(r => r.id !== deletingRoom.id))
                      setDeleteDialogOpen(false)
                      setDeletingRoom(null)
                    } catch (error) {
                      console.error("Error deleting room:", error)
                      alert("Failed to delete room. Please try again.")
                    }
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}

