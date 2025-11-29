# PropertyManage Hub

A modern, premium multi-property management system for hotels and resorts built with Next.js 14, TypeScript, TailwindCSS, and ShadCN UI.

## Features

- 🏨 **Multi-Property Management** - Manage multiple hotels, resorts, and villas from one dashboard
- 📅 **Booking Management** - Comprehensive booking system with calendar views
- 📊 **Analytics & Reports** - Revenue tracking, occupancy rates, and detailed reports
- 🔄 **OTA Integration** - Sync with Airbnb, Booking.com, MakeMyTrip, and Goibibo
- 👥 **Staff Management** - Manage staff members with role-based permissions
- 💰 **Finance Tracking** - Payment logs, pending payouts, and financial reports
- 🎨 **Modern UI** - Clean, premium design with responsive layout

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings (use GitHub Actions)
3. The workflow will automatically deploy on push to `main` branch

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard (home page)
│   ├── properties/        # Properties pages
│   │   └── [id]/          # Property detail pages
│   ├── bookings/          # Bookings page
│   ├── calendar/          # Calendar page
│   ├── ota-sync/          # OTA Sync page
│   ├── rooms/             # Rooms page
│   ├── finance/           # Finance page
│   ├── staff/             # Staff page
│   ├── settings/          # Settings page
│   └── reports/           # Reports page
├── components/
│   ├── layout/            # Layout components (Sidebar, Topbar)
│   ├── reusable/          # Reusable components
│   └── ui/                # ShadCN UI components
├── lib/                   # Utility functions
├── public/                # Static assets
└── .github/
    └── workflows/         # GitHub Actions workflows
```

## Pages Overview

### Dashboard
- Stat cards showing key metrics
- Revenue charts
- Booking source analysis
- Recent bookings table
- Upcoming check-ins

### Properties
- Grid/list view of all properties
- Filter by location, type, and status
- Property detail pages with tabs:
  - Overview
  - Rooms
  - Pricing
  - Amenities
  - Gallery
  - Bookings

### Bookings
- Comprehensive bookings table
- Advanced filters (date, status, property, source)
- Booking detail drawer with full information

### Calendar
- Month, Week, and Day views
- Color-coded bookings by source
- Interactive calendar interface

### OTA Sync
- Platform status cards
- Connection management
- Sync logs and controls

### Rooms
- Room list across all properties
- Status and cleanliness tracking
- Filter by property and status

### Finance
- Revenue charts
- Payment logs
- Pending payouts
- Tax and settlement tracking

### Staff
- Staff member management
- Role assignment
- Permission management

### Settings
- Profile settings
- Property configuration
- Notification preferences
- Integration management
- Brand customization

### Reports
- Revenue reports
- Occupancy reports
- Booking analysis
- Guest reports
- Financial reports
- OTA performance reports

## Design System

- **Colors**: Clean, modern palette with primary blue (#3b82f6)
- **Typography**: Inter font family
- **Spacing**: Consistent padding (p-6 to p-10)
- **Cards**: Rounded-2xl with soft shadows
- **Background**: Light gray (#f7f7f8)

## Development

### Build for Production

```bash
npm run build
```

### Build for GitHub Pages

```bash
npm run build:gh-pages
```

### Start Production Server

```bash
npm start
```

## Additional Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed GitHub Pages deployment guide
- [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) - Quick setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

## License

MIT

