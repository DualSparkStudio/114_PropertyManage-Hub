# Public Booking Site Guide

## Overview

The PropertyManage Hub now has **two separate interfaces**:

1. **Public Booking Site** - For customers to browse and book properties
2. **Admin Dashboard** - For property managers to manage everything

## Public Site Routes

### `/` (Homepage)
- Redirects to `/explore`

### `/explore`
- **Public properties listing page**
- Browse all available properties
- Search and filter by location, type
- View property cards with images, ratings, prices
- Click "View Details" to see property details

### `/property/[id]`
- **Property detail page with booking form**
- Large image gallery
- Property description and amenities
- Guest reviews
- **Booking widget** on the right:
  - Select check-in/check-out dates
  - Select number of guests
  - See price calculation
  - "Book Now" button

### `/checkout`
- **Booking checkout page**
- Guest information form
- Booking summary
- Payment details (UI only - no actual payment processing)
- "Confirm Booking" button

### `/confirmation`
- **Booking confirmation page**
- Success message with booking ID
- Booking details summary
- Links to browse more or go to admin

## Admin Dashboard Routes

All admin pages are accessible at their original routes:
- `/admin` - Dashboard (moved from `/`)
- `/properties` - Properties management
- `/bookings` - Bookings management
- `/calendar` - Calendar view
- `/ota-sync` - OTA integrations
- `/rooms` - Room management
- `/finance` - Financial reports
- `/staff` - Staff management
- `/reports` - Reports
- `/settings` - Settings

## Navigation

### Public Site Header
- Logo links to `/explore`
- "Explore" link
- "Admin" link (for property managers)

### Admin Sidebar
- All admin navigation items
- Accessible when logged into admin panel

## User Flow

### Customer Booking Flow:
1. Visit `/explore` → Browse properties
2. Click property → `/property/[id]` → View details
3. Select dates & guests → Click "Book Now"
4. `/checkout` → Fill guest information
5. Confirm booking → `/confirmation` → Success!

### Admin Management Flow:
1. Access admin at any `/admin/*` route
2. Manage properties, bookings, etc.
3. View all customer bookings in admin dashboard

## Features

### Public Site Features:
- ✅ Property browsing with search & filters
- ✅ Property detail pages with galleries
- ✅ Date selection for bookings
- ✅ Guest count selection
- ✅ Price calculation
- ✅ Booking form
- ✅ Confirmation page

### Admin Features:
- ✅ Full property management
- ✅ Booking management
- ✅ Calendar view
- ✅ Financial tracking
- ✅ Staff management
- ✅ Reports & analytics

## Design

### Public Site:
- Clean, modern booking interface
- Property-focused design
- Easy-to-use booking flow
- Mobile responsive

### Admin Dashboard:
- Professional dashboard layout
- Data-rich interface
- Management tools
- Analytics & reports

## Next Steps

To complete the integration:
1. Connect booking form to backend API
2. Add payment processing
3. Add email notifications
4. Sync bookings with admin dashboard
5. Add user authentication (optional)
6. Add booking management for customers

