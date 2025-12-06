import { supabase } from './client'
import type { Property, PropertyWithDetails, PropertyImage, RoomType, Attraction, Feature, PropertyAbout, PropertyContact } from '@/lib/types/database'

/**
 * Get all properties
 */
export async function getAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    throw error
  }

  return data || []
}

/**
 * Get property by slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching property:', error)
    throw error
  }

  return data
}

/**
 * Get property with all related data (images, rooms, attractions, etc.)
 */
export async function getPropertyWithDetails(slug: string): Promise<PropertyWithDetails | null> {
  const property = await getPropertyBySlug(slug)
  if (!property) return null

  // Fetch related data in parallel
  const [images, roomTypes, attractions, features, about, contact] = await Promise.all([
    getPropertyImages(property.id),
    getPropertyRoomTypes(property.id),
    getPropertyAttractions(property.id),
    getPropertyFeatures(property.id),
    getPropertyAbout(property.id),
    getPropertyContact(property.id),
  ])

  return {
    ...property,
    images,
    room_types: roomTypes,
    attractions,
    features,
    about: about || undefined,
    contact: contact || undefined,
  }
}

/**
 * Get property images
 */
export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching property images:', error)
    throw error
  }

  return data || []
}

/**
 * Get room types for a property
 */
export async function getPropertyRoomTypes(propertyId: string): Promise<RoomType[]> {
  const { data, error } = await supabase
    .from('room_types')
    .select('*')
    .eq('property_id', propertyId)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching room types:', error)
    throw error
  }

  return data || []
}

/**
 * Get attractions for a property
 */
export async function getPropertyAttractions(propertyId: string): Promise<Attraction[]> {
  const { data, error } = await supabase
    .from('attractions')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching attractions:', error)
    throw error
  }

  return data || []
}

/**
 * Get features for a property
 */
export async function getPropertyFeatures(propertyId: string): Promise<Feature[]> {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching features:', error)
    throw error
  }

  return data || []
}

/**
 * Get property about information
 */
export async function getPropertyAbout(propertyId: string): Promise<PropertyAbout | null> {
  const { data, error } = await supabase
    .from('property_about')
    .select('*')
    .eq('property_id', propertyId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching property about:', error)
    throw error
  }

  return data
}

/**
 * Get property contact information
 */
export async function getPropertyContact(propertyId: string): Promise<PropertyContact | null> {
  const { data, error } = await supabase
    .from('property_contact')
    .select('*')
    .eq('property_id', propertyId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching property contact:', error)
    throw error
  }

  return data
}

/**
 * Create a new property (admin only)
 */
export async function createProperty(property: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single()

  if (error) {
    console.error('Error creating property:', error)
    throw error
  }

  return data
}

/**
 * Update a property (admin only)
 */
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating property:', error)
    throw error
  }

  return data
}

/**
 * Delete a property (admin only)
 */
export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

