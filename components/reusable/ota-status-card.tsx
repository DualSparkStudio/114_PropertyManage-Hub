import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock } from "lucide-react"

interface OTAPlatform {
  id: string
  name: string
  status: "connected" | "disconnected"
  lastSync: string
  icon: string
}

interface OTAStatusCardProps {
  platform: OTAPlatform
}

export function OTAStatusCard({ platform }: OTAStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{platform.icon}</span>
            <div>
              <CardTitle>{platform.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={platform.status === "connected" ? "success" : "destructive"}
                >
                  {platform.status === "connected" ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last sync: {platform.lastSync}</span>
        </div>
        {platform.status === "connected" && (
          <div className="space-y-2">
            <div className="text-sm">
              <p className="text-muted-foreground">Sync Logs</p>
              <div className="mt-2 space-y-1">
                <div className="text-xs p-2 bg-muted rounded">
                  ✓ Synced 5 bookings successfully
                </div>
                <div className="text-xs p-2 bg-muted rounded">
                  ✓ Updated 3 room availabilities
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
          </div>
        )}
        {platform.status === "disconnected" && (
          <Button className="w-full">Connect</Button>
        )}
      </CardContent>
    </Card>
  )
}

