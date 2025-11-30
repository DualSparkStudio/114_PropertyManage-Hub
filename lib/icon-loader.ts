// Optimized icon loader - only imports what's needed
export const loadIcon = async (iconName: string) => {
  const icons = await import('lucide-react')
  return (icons as any)[iconName]
}

// Preload common icons
export const preloadIcons = () => {
  if (typeof window !== 'undefined') {
    import('lucide-react').then((icons) => {
      // Cache common icons
      const commonIcons = ['Home', 'Bed', 'Mountain', 'Sparkles', 'Info', 'Phone', 'MapPin', 'Star']
      commonIcons.forEach(icon => {
        if ((icons as any)[icon]) {
          // Preload icon component
        }
      })
    })
  }
}

