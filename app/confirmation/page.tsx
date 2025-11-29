"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Users, MapPin } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId") || "12345"

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Your reservation has been successfully confirmed
            </p>

            <div className="bg-muted rounded-xl p-6 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold">{bookingId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-semibold">Grand Hotel</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-semibold">Jan 15, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-semibold">Jan 18, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold text-lg">$495</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your email address with all the booking details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/explore">Browse More Properties</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/admin">Go to Admin Panel</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

