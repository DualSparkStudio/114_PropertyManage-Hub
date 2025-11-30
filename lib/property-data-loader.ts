// Lazy load property data to reduce initial bundle size
let propertyDataCache: any = null

export const loadPropertyData = async () => {
  if (propertyDataCache) {
    return propertyDataCache
  }

  const { propertyData } = await import('@/app/property/[id]/property-data')
  propertyDataCache = propertyData
  return propertyData
}

export const getProperty = async (slug: string) => {
  const data = await loadPropertyData()
  return data[slug] || data["grand-hotel"]
}

// Preload property data on hover over property links
export const preloadPropertyData = () => {
  if (typeof window !== 'undefined' && !propertyDataCache) {
    loadPropertyData()
  }
}

