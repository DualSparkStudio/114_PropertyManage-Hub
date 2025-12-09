"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, TrendingUp, Power, PowerOff, Trash2 } from "lucide-react"
import Link from "next/link"
import { updatePropertyStatus, deleteProperty } from "@/lib/supabase/properties"
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

interface PropertyCardProps {
  id: string
  name: string
  type: string
  location: string
  rooms: number
  occupancy: number
  image: string
  status: 'active' | 'inactive'
  onUpdate?: () => void
}

export function PropertyCard({
  id,
  name,
  type,
  location,
  rooms,
  occupancy,
  image,
  status,
  onUpdate,
}: PropertyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async () => {
    setIsUpdating(true)
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active'
      await updatePropertyStatus(id, newStatus)
      onUpdate?.()
    } catch (error) {
      console.error('Error updating property status:', error)
      alert('Failed to update property status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProperty(id)
      setShowDeleteDialog(false)
      onUpdate?.()
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Badge 
              variant={status === 'active' ? 'default' : 'secondary'} 
              className="bg-white/95 backdrop-blur-sm shadow-md border border-gray-200/50 font-semibold"
            >
              {type}
            </Badge>
            <Badge 
              variant={status === 'active' ? 'default' : 'destructive'} 
              className="bg-white/95 backdrop-blur-sm shadow-md border border-gray-200/50 font-semibold"
            >
              {status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{rooms} Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{occupancy}%</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/properties/${id}`}>View Property</Link>
          </Button>
          <div className="flex gap-2 w-full">
            <Button
              variant={status === 'active' ? 'secondary' : 'default'}
              size="sm"
              className="flex-1"
              onClick={handleStatusToggle}
              disabled={isUpdating}
            >
              {status === 'active' ? (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{name}&quot;? This action cannot be undone and will delete all associated data including bookings, rooms, and images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

