import { supabase } from './client'
import type { Room } from '@/lib/types/database'

/**
 * Get all rooms
 */
export async function getAllRooms(): Promise<(Room & { property_name?: string; room_type_name?: string })[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      properties!inner(name),
      room_types(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rooms:', error)
    throw error
  }

  return (data || []).map((room: any) => ({
    ...room,
    property_name: room.properties?.name,
    room_type_name: room.room_types?.name,
  }))
}

/**
 * Get rooms by property ID
 */
export async function getRoomsByProperty(propertyId: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('room_number', { ascending: true })

  if (error) {
    console.error('Error fetching rooms by property:', error)
    throw error
  }

  return data || []
}

/**
 * Get room by ID
 */
export async function getRoomById(id: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching room:', error)
    throw error
  }

  return data
}

/**
 * Create a new room
 */
export async function createRoom(room: {
  property_id: string
  room_type_id: string
  room_number: string
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
}): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      ...room,
      status: room.status || 'available',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating room:', error)
    throw error
  }

  return data
}

/**
 * Update a room
 */
export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating room:', error)
    throw error
  }

  return data
}

/**
 * Delete a room
 */
export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting room:', error)
    throw error
  }
}

