import { supabase } from './client'
import type { Booking, BookingWithDetails } from '@/lib/types/database'

/**
 * Get all bookings
 */
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }

  return data || []
}

/**
 * Get bookings with property and room details
 */
export async function getBookingsWithDetails(): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      room:rooms(*),
      room_type:room_types(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings with details:', error)
    throw error
  }

  return data || []
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching booking:', error)
    throw error
  }

  return data
}

/**
 * Get bookings by property ID
 */
export async function getBookingsByProperty(propertyId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Error fetching bookings by property:', error)
    throw error
  }

  return data || []
}

/**
 * Get bookings by date range
 */
export async function getBookingsByDateRange(
  startDate: string,
  endDate: string
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('check_in', startDate)
    .lte('check_out', endDate)
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Error fetching bookings by date range:', error)
    throw error
  }

  return data || []
}

/**
 * Create a new booking
 */
export async function createBooking(booking: {
  property_id: string
  room_id?: string | null
  room_type_id?: string | null
  guest_name: string
  guest_email: string
  guest_phone?: string | null
  check_in: string
  check_out: string
  guests: number
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  source?: 'website' | 'airbnb' | 'booking.com' | 'makemytrip' | 'goibibo' | 'manual'
  amount: number
  special_requests?: string | null
}): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      status: booking.status || 'pending',
      source: booking.source || 'website',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }

  return data
}

/**
 * Update a booking
 */
export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating booking:', error)
    throw error
  }

  return data
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting booking:', error)
    throw error
  }
}

/**
 * Calculate occupancy percentage for a property
 */
export async function calculateOccupancy(propertyId: string, totalRooms: number): Promise<number> {
  if (totalRooms === 0) return 0
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed')
    .lte('check_in', today)
    .gte('check_out', today)

  if (error) {
    console.error('Error calculating occupancy:', error)
    return 0
  }

  const activeBookings = data?.length || 0
  const occupancy = Math.min(Math.round((activeBookings / totalRooms) * 100), 100)
  return occupancy
}

/**
 * Get booking statistics
 */
export async function getBookingStats(propertyId?: string) {
  let query = supabase.from('bookings').select('*', { count: 'exact', head: false })

  if (propertyId) {
    query = query.eq('property_id', propertyId)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching booking stats:', error)
    throw error
  }

  const bookings = data || []
  const total = count || 0
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length
  const pending = bookings.filter((b) => b.status === 'pending').length
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.amount), 0)

  return {
    total,
    confirmed,
    pending,
    cancelled,
    totalRevenue,
  }
}

