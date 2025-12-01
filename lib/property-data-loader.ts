// Lazy load property data to reduce initial bundle size
let propertyDataCache: any = null

export const loadPropertyData = async () => {
  if (propertyDataCache) {
    return propertyDataCache
  }

  const dataModule = await import('@/lib/data/property-data')
  const propertyData = dataModule.propertyData
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

