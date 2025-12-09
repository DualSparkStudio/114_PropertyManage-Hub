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
 * Check for overlapping bookings to prevent double bookings
 */
export async function checkBookingConflict(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  roomId?: string | null,
  roomTypeId?: string | null,
  excludeBookingId?: string
): Promise<{ hasConflict: boolean; conflictingBookings: Booking[] }> {
  // Get all confirmed bookings for this property
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed')

  if (excludeBookingId) {
    query = query.neq('id', excludeBookingId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking booking conflicts:', error)
    throw error
  }

  const bookings = data || []
  
  // Filter for actual overlaps
  const conflictingBookings = bookings.filter((booking) => {
    const bookingCheckIn = new Date(booking.check_in)
    const bookingCheckOut = new Date(booking.check_out)
    const newCheckIn = new Date(checkIn)
    const newCheckOut = new Date(checkOut)

    // Normalize dates to midnight for accurate comparison
    bookingCheckIn.setHours(0, 0, 0, 0)
    bookingCheckOut.setHours(0, 0, 0, 0)
    newCheckIn.setHours(0, 0, 0, 0)
    newCheckOut.setHours(0, 0, 0, 0)

    // Check if dates overlap (inclusive check-in, exclusive check-out)
    const datesOverlap = newCheckIn < bookingCheckOut && newCheckOut > bookingCheckIn

    if (!datesOverlap) return false

    // If specific room is booked, check room conflict
    if (roomId && booking.room_id) {
      return booking.room_id === roomId
    }

    // If room type is specified, check room type conflict
    if (roomTypeId && booking.room_type_id) {
      return booking.room_type_id === roomTypeId
    }

    // For property-level bookings without specific room/room type, 
    // we need to check total availability (handled by checkPropertyAvailability)
    return false
  })

  return {
    hasConflict: conflictingBookings.length > 0,
    conflictingBookings,
  }
}

/**
 * Check if all rooms of a property are booked for a date range
 */
export async function checkPropertyAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<{ isAvailable: boolean; availableRooms: number; totalRooms: number }> {
  // Get total rooms from room types
  const { data: roomTypes, error: roomTypesError } = await supabase
    .from('room_types')
    .select('number_of_rooms')
    .eq('property_id', propertyId)

  if (roomTypesError) {
    console.error('Error fetching room types:', roomTypesError)
    throw roomTypesError
  }

  const totalRooms = roomTypes?.reduce((sum, rt) => sum + (rt.number_of_rooms || 1), 0) || 0

  if (totalRooms === 0) {
    return { isAvailable: false, availableRooms: 0, totalRooms: 0 }
  }

  // Get all confirmed bookings for this property
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed')

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
    throw bookingsError
  }

  // Filter bookings that overlap with the requested date range
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  checkInDate.setHours(0, 0, 0, 0)
  checkOutDate.setHours(0, 0, 0, 0)

  const overlappingBookings = bookings?.filter((booking) => {
    const bookingCheckIn = new Date(booking.check_in)
    const bookingCheckOut = new Date(booking.check_out)
    bookingCheckIn.setHours(0, 0, 0, 0)
    bookingCheckOut.setHours(0, 0, 0, 0)

    // Check if dates overlap (inclusive check-in, exclusive check-out)
    return checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn
  }) || []

  // Count unique bookings (each booking represents one room)
  const bookedRooms = overlappingBookings.length
  const availableRooms = Math.max(0, totalRooms - bookedRooms)

  return {
    isAvailable: availableRooms > 0,
    availableRooms,
    totalRooms,
  }
}

/**
 * Create a new booking with conflict checking
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
  // Check for conflicts before creating
  const conflict = await checkBookingConflict(
    booking.property_id,
    booking.check_in,
    booking.check_out,
    booking.room_id,
    booking.room_type_id
  )

  if (conflict.hasConflict && booking.status === 'confirmed') {
    throw new Error('Booking conflict: Room is already booked for these dates')
  }

  // Check property availability
  const availability = await checkPropertyAvailability(
    booking.property_id,
    booking.check_in,
    booking.check_out
  )

  if (!availability.isAvailable && booking.status === 'confirmed') {
    throw new Error('All rooms are booked for these dates')
  }

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

