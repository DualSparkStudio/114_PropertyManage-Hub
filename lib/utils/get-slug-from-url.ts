/**
 * Extract property slug from the current URL
 * Used when static export doesn't have the page generated for a changed slug
 */
export function getSlugFromUrl(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  
  const path = window.location.pathname
  // Path format: /property/slug or /property/slug/subroute
  // Also handle basePath for GitHub Pages
  const pathParts = path.split('/').filter(Boolean)
  
  // Find 'property' in path and get the next part
  const propertyIndex = pathParts.indexOf('property')
  if (propertyIndex !== -1 && pathParts[propertyIndex + 1]) {
    return pathParts[propertyIndex + 1]
  }
  
  return ''
}

