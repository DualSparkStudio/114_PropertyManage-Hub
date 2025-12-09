/**
 * Convert a string to a URL-friendly slug
 * Example: "Grand Hotel" -> "grand-hotel"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  // This function would check if the slug exists and append a number if needed
  // For now, we'll just return the base slug
  // In a real implementation, you'd query the database to check for duplicates
  return baseSlug
}

