import { supabase } from './client'
import type { Staff } from '@/lib/types/database'

/**
 * Get all staff
 */
export async function getAllStaff(): Promise<(Staff & { property_name?: string })[]> {
  const { data, error } = await supabase
    .from('staff')
    .select(`
      *,
      properties!inner(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching staff:', error)
    throw error
  }

  return (data || []).map((staff: any) => ({
    ...staff,
    property_name: staff.properties?.name,
  }))
}

/**
 * Get staff by property ID
 */
export async function getStaffByProperty(propertyId: string): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching staff by property:', error)
    throw error
  }

  return data || []
}

/**
 * Get staff by ID
 */
export async function getStaffById(id: string): Promise<Staff | null> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching staff:', error)
    throw error
  }

  return data
}

/**
 * Create a new staff member
 */
export async function createStaff(staff: {
  property_id: string
  name: string
  role: string
  phone?: string | null
  email?: string | null
  status?: 'active' | 'inactive'
}): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      ...staff,
      status: staff.status || 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating staff:', error)
    throw error
  }

  return data
}

/**
 * Update a staff member
 */
export async function updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating staff:', error)
    throw error
  }

  return data
}

/**
 * Delete a staff member
 */
export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting staff:', error)
    throw error
  }
}

