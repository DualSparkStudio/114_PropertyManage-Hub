/**
 * Converts Google Drive sharing links to direct image URLs
 * Handles multiple Google Drive URL formats
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || !url.includes('drive.google.com')) {
    return url
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null

  // Format: https://drive.google.com/file/d/FILE_ID/view
  // Format: https://drive.google.com/file/d/FILE_ID/edit
  // Format: https://drive.google.com/file/d/FILE_ID/preview
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) {
    fileId = fileMatch[1]
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }
  }

  // Format: https://drive.google.com/uc?id=FILE_ID (already converted, but check)
  if (!fileId) {
    const ucMatch = url.match(/\/uc\?[^&]*id=([a-zA-Z0-9_-]+)/)
    if (ucMatch) {
      fileId = ucMatch[1]
    }
  }

  // Convert to direct image URL
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // If we can't extract the file ID, return the original URL
  return url
}

