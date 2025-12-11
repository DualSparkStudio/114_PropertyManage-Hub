# Breadcrumb Implementation Guide

## Where to Add Breadcrumbs

### 1. **Property Pages** (`/property/[id]/*`)
Add breadcrumbs below the navbar, showing the navigation path:
- **Location**: Right after `<Navbar>` component
- **Example**: `Home > BeachR > Rooms`
- **Files to update**:
  - `app/property/[id]/property-home-client.tsx`
  - `app/property/[id]/rooms/property-rooms-client.tsx`
  - `app/property/[id]/attractions/property-attractions-client.tsx`
  - `app/property/[id]/features/property-features-client.tsx`
  - `app/property/[id]/about/property-about-client.tsx`
  - `app/property/[id]/contact/property-contact-client.tsx`

### 2. **Explore Pages** (`/explore/*`)
Add breadcrumbs below the navbar:
- **Location**: Right after `<Navbar>` component, before hero/content
- **Example**: `Home > Rooms` or `Home > Attractions`
- **Files to update**:
  - `app/explore/page.tsx`
  - `app/explore/rooms/page.tsx`
  - `app/explore/attractions/page.tsx`
  - `app/explore/features/page.tsx`
  - `app/explore/about/page.tsx`
  - `app/explore/contact/page.tsx`

### 3. **Admin Pages** (`/admin/*`, `/properties/*`, etc.)
Add breadcrumbs below the topbar:
- **Location**: Inside `<MainLayout>`, right after the opening tag
- **Example**: `Admin > Properties` or `Admin > Bookings`
- **Files to update**:
  - `app/admin/page.tsx`
  - `app/properties/page.tsx`
  - `app/properties/[id]/page.tsx`
  - `app/bookings/page.tsx`
  - `app/calendar/page.tsx`
  - `app/rooms/page.tsx`
  - Other admin pages

### 4. **Property Detail Pages in Admin** (`/properties/[id]`)
Add breadcrumbs showing the full path:
- **Location**: Inside the property details component
- **Example**: `Admin > Properties > BeachR`
- **File to update**: `app/properties/[id]/property-details-client.tsx`

## Example Implementation

### For Property Pages:
```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { getPropertyById } from "@/lib/supabase/properties"

// In component:
const [property, setProperty] = useState<Property | null>(null)

// In JSX, after Navbar:
<Navbar variant="property" propertyId={propertyId} />

<div className="container mx-auto px-4 md:px-6 py-4">
  <Breadcrumb
    items={[
      { label: "Home", href: "/explore" },
      { label: property?.name || "Property", href: `/property/${propertyId}` },
      { label: "Rooms" }, // Current page
    ]}
  />
</div>
```

### For Explore Pages:
```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"

// In JSX, after Navbar:
<Navbar variant="explore" />

<div className="container mx-auto px-4 md:px-6 py-4">
  <Breadcrumb
    items={[
      { label: "Home", href: "/explore" },
      { label: "Rooms" }, // Current page
    ]}
  />
</div>
```

### For Admin Pages:
```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb"

// In JSX, inside MainLayout:
<MainLayout>
  <div className="mb-4">
    <Breadcrumb
      items={[
        { label: "Admin", href: "/admin" },
        { label: "Properties" }, // Current page
      ]}
    />
  </div>
  {/* Rest of content */}
</MainLayout>
```

## Breadcrumb Component

The breadcrumb component is already created at `components/ui/breadcrumb.tsx` and ready to use!

