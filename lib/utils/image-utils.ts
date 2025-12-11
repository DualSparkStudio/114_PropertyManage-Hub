import { convertGoogleDriveUrl } from "./convert-google-drive-url"

/**
 * Validates and converts image URLs, with fallback handling
 */
export function processImageUrl(url: string | null | undefined): string {
  if (!url) {
    return ''
  }

  // Convert Google Drive URLs
  const converted = convertGoogleDriveUrl(url)
  
  // Additional validation
  if (!converted || converted.trim() === '') {
    console.warn('Empty image URL after conversion')
    return ''
  }

  return converted
}

/**
 * Checks if an image URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url?.includes('drive.google.com') || false
}

