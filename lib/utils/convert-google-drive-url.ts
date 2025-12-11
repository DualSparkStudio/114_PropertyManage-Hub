/**
 * Converts Google Drive sharing links to direct image URLs
 * Handles multiple Google Drive URL formats
 * 
 * Note: For Google Drive images to work, the file must be shared publicly
 * or use the thumbnail format which works better for public access
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url || ''
  }

  // If it's already a direct image URL (not Google Drive), return as is
  if (!url.includes('drive.google.com')) {
    return url
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null

  // Format: https://drive.google.com/file/d/FILE_ID/view
  // Format: https://drive.google.com/file/d/FILE_ID/edit
  // Format: https://drive.google.com/file/d/FILE_ID/preview
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch && fileMatch[1]) {
    fileId = fileMatch[1]
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch && openMatch[1]) {
      fileId = openMatch[1]
    }
  }

  // Format: https://drive.google.com/uc?id=FILE_ID (already converted, but extract ID)
  if (!fileId) {
    const ucMatch = url.match(/\/uc\?[^&]*id=([a-zA-Z0-9_-]+)/)
    if (ucMatch && ucMatch[1]) {
      fileId = ucMatch[1]
    }
  }

  // Convert to direct image URL
  // Using multiple formats for better compatibility
  if (fileId) {
    // Primary format: export=view (works for publicly shared files)
    // This is the most reliable format for Google Drive images
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // If we can't extract the file ID, return the original URL
  console.warn('Could not extract file ID from Google Drive URL:', url)
  return url
}

