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
  // First, verify the property exists and get its actual ID
  let actualId = id
  
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const isUUID = uuidRegex.test(id)
  
  if (isUUID) {
    // Try to find by ID
    const { data: checkData } = await supabase
      .from('properties')
      .select('id')
      .eq('id', id)
      .maybeSingle()
    
    if (!checkData) {
      // Not found by ID, try by slug
      const { data: slugCheck } = await supabase
        .from('properties')
        .select('id')
        .eq('slug', id)
        .maybeSingle()
      
      if (!slugCheck) {
        throw new Error(`Property with id/slug "${id}" not found`)
      }
      
      actualId = slugCheck.id
    }
  } else {
    // Not a UUID, try by slug
    const { data: slugCheck } = await supabase
      .from('properties')
      .select('id')
      .eq('slug', id)
      .maybeSingle()
    
    if (!slugCheck) {
      throw new Error(`Property with slug "${id}" not found`)
    }
    
    actualId = slugCheck.id
  }

  // Now update with the correct ID - use .maybeSingle() to handle 0 rows gracefully
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', actualId)
    .select()

  if (error) {
    console.error('Error updating property:', error)
    throw error
  }

  // Check if we got any results
  if (!data || data.length === 0) {
    // Try to fetch the property to see if it exists
    const { data: verifyData } = await supabase
      .from('properties')
      .select('id')
      .eq('id', actualId)
      .maybeSingle()
    
    if (!verifyData) {
      throw new Error(`Property with id "${actualId}" not found`)
    } else {
      // Property exists but update returned no rows - might be a permissions issue
      throw new Error(`Failed to update property. No rows were updated. This might be a permissions issue.`)
    }
  }

  return data[0]
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

/**
 * Create or update a room type
 */
export async function upsertRoomType(roomType: Partial<RoomType> & { property_id: string }): Promise<RoomType> {
  const isNew = !roomType.id || roomType.id.startsWith('new-')
  
  if (isNew) {
    // Create new room type
    const { id, ...insertData } = roomType
    const { data, error } = await supabase
      .from('room_types')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating room type:', error)
      throw error
    }

    return data
  } else {
    // Update existing room type
    const { id, ...updateData } = roomType
    const { data, error } = await supabase
      .from('room_types')
      .update(updateData)
      .eq('id', id!)
      .select()

    if (error) {
      console.error('Error updating room type:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error(`Room type with id "${id}" not found or could not be updated`)
    }

    return data[0]
  }
}

/**
 * Delete a room type
 */
export async function deleteRoomType(roomTypeId: string): Promise<void> {
  const { error } = await supabase
    .from('room_types')
    .delete()
    .eq('id', roomTypeId)

  if (error) {
    console.error('Error deleting room type:', error)
    throw error
  }
}

/**
 * Get images for a room type
 */
export async function getRoomTypeImages(roomTypeId: string): Promise<Array<{ id: string; url: string; alt_text: string | null; order_index: number }>> {
  try {
    const { data, error } = await supabase
      .from('room_type_images')
      .select('id, url, alt_text, order_index')
      .eq('room_type_id', roomTypeId)
      .order('order_index', { ascending: true })

    // If table doesn't exist (404), return empty array
    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return []
      }
      console.error('Error fetching room type images:', error)
      throw error
    }

    return data || []
  } catch (error: any) {
    // Handle 404 or table not found errors gracefully
    if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist') || error?.status === 404) {
      return []
    }
    throw error
  }
}

/**
 * Upsert room type images (replace all images for a room type)
 */
export async function upsertRoomTypeImages(roomTypeId: string, imageUrls: string[]): Promise<void> {
  try {
    // Delete existing images
    const { error: deleteError } = await supabase
      .from('room_type_images')
      .delete()
      .eq('room_type_id', roomTypeId)

    // If table doesn't exist, skip (table might not be created yet)
    if (deleteError && deleteError.code !== 'PGRST116' && !deleteError.message?.includes('relation') && !deleteError.message?.includes('does not exist') && deleteError.status !== 404) {
      console.error('Error deleting room type images:', deleteError)
      throw deleteError
    }

    // Insert new images
    if (imageUrls.length > 0) {
      const images = imageUrls.map((url, index) => ({
        room_type_id: roomTypeId,
        url,
        alt_text: null,
        order_index: index,
      }))

      const { error: insertError } = await supabase
        .from('room_type_images')
        .insert(images)

      if (insertError) {
        // If table doesn't exist, just log a warning instead of throwing
        if (insertError.code === 'PGRST116' || insertError.message?.includes('relation') || insertError.message?.includes('does not exist') || insertError.status === 404) {
          console.warn('room_type_images table does not exist yet. Please run the migration SQL.')
          return
        }
        console.error('Error inserting room type images:', insertError)
        throw insertError
      }
    }
  } catch (error: any) {
    // Handle table not found errors gracefully
    if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist') || error?.status === 404) {
      console.warn('room_type_images table does not exist yet. Please run the migration SQL.')
      return
    }
    throw error
  }
}

