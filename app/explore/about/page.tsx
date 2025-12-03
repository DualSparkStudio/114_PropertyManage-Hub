"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="explore" />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-muted-foreground">Learn more about PropertyManage Hub</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                PropertyManage Hub has been serving guests with excellence since 1920. Located in the heart of major cities, 
                we offer a perfect blend of historic charm and modern luxury. Our commitment to exceptional service and 
                attention to detail has made us a preferred choice for travelers from around the world.
              </p>
              <p className="text-muted-foreground">
                Established in 1920, our properties have hosted numerous celebrities, dignitaries, and world leaders. 
                We underwent major renovations in 2018, preserving our historic character while adding modern amenities 
                to ensure the comfort of our guests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Awards & Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>AAA Five Diamond Award</li>
                <li>Travel + Leisure World&apos;s Best</li>
                <li>Conde Nast Readers&apos; Choice</li>
                <li>TripAdvisor Travelers&apos; Choice</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide exceptional hospitality experiences that exceed our guests&apos; expectations while maintaining 
                the highest standards of service, comfort, and sustainability. We strive to create memorable stays 
                that guests will cherish for a lifetime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}


