"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { OTAStatusCard } from "@/components/reusable/ota-status-card"
import { Card, CardContent } from "@/components/ui/card"

type OTAPlatform = {
  id: string
  name: string
  status: "connected" | "disconnected"
  lastSync: string
  icon: string
}

const otaPlatforms: OTAPlatform[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    status: "connected",
    lastSync: "2 minutes ago",
    icon: "🏠",
  },
  {
    id: "booking",
    name: "Booking.com",
    status: "connected",
    lastSync: "5 minutes ago",
    icon: "🌐",
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip",
    status: "disconnected",
    lastSync: "Never",
    icon: "✈️",
  },
  {
    id: "goibibo",
    name: "Goibibo",
    status: "disconnected",
    lastSync: "Never",
    icon: "🚗",
  },
]

export default function OTASyncPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="OTA Sync"
          description="Manage integrations with online travel agencies"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {otaPlatforms.map((platform) => (
            <OTAStatusCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

