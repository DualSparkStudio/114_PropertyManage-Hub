// TypeScript types for Supabase database tables

export interface Property {
  id: string
  slug: string
  name: string
  location: string
  price: number
  rating: number
  reviews: number
  description: string | null
  amenities: string[]
  total_rooms: number
  type: string
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  alt_text: string | null
  order_index: number
  created_at: string
}

export interface RoomType {
  id: string
  property_id: string
  name: string
  price: number
  beds: string
  size: string
  image_url: string | null
  max_guests: number
  additional_price_per_extra_guest: number
  description: string | null
  amenities: string[] | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  property_id: string
  room_type_id: string
  room_number: string
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  created_at: string
  updated_at: string
}

export interface Attraction {
  id: string
  property_id: string
  name: string
  distance: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface Feature {
  id: string
  property_id: string
  name: string
  icon: string | null
  description: string | null
  created_at: string
}

export interface PropertyAbout {
  id: string
  property_id: string
  description: string | null
  history: string | null
  awards: string[] | null
  created_at: string
  updated_at: string
}

export interface PropertyContact {
  id: string
  property_id: string
  phone: string | null
  email: string | null
  address: string | null
  hours: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  property_id: string
  room_id: string | null
  room_type_id: string | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  check_in: string
  check_out: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  source: 'website' | 'airbnb' | 'booking.com' | 'makemytrip' | 'goibibo' | 'manual'
  amount: number
  special_requests: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin' | 'staff'
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  user_id: string | null
  property_id: string
  name: string
  role: string
  phone: string | null
  email: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface FinanceTransaction {
  id: string
  property_id: string
  booking_id: string | null
  type: 'revenue' | 'expense' | 'payout'
  amount: number
  description: string | null
  status: 'pending' | 'completed' | 'cancelled'
  transaction_date: string
  created_at: string
}

export interface OTASyncLog {
  id: string
  property_id: string
  platform: 'airbnb' | 'booking.com' | 'makemytrip' | 'goibibo'
  sync_type: 'bookings' | 'availability' | 'pricing'
  status: 'success' | 'failed' | 'pending'
  message: string | null
  data: any
  created_at: string
}

// Extended types with relations
export interface PropertyWithDetails extends Property {
  images?: PropertyImage[]
  room_types?: RoomType[]
  attractions?: Attraction[]
  features?: Feature[]
  about?: PropertyAbout
  contact?: PropertyContact
}

export interface BookingWithDetails extends Booking {
  property?: Property
  room?: Room
  room_type?: RoomType
}

