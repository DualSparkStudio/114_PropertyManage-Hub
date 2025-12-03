"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/explore" className="text-2xl font-bold text-primary">
              PropertyManage
            </Link>
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="py-2 text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link href="/explore/rooms" className="py-2 text-muted-foreground hover:text-foreground">
                  Rooms
                </Link>
                <Link href="/explore/attractions" className="py-2 text-muted-foreground hover:text-foreground">
                  Attractions
                </Link>
                <Link href="/explore/features" className="py-2 text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/explore/about" className="py-2 border-b-2 border-primary text-primary font-medium">
                  About
                </Link>
                <Link href="/explore/contact" className="py-2 text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
              <span className="hidden md:block text-muted-foreground">|</span>
              <nav className="flex items-center gap-6">
                <Link href="/explore" className="text-sm font-medium hover:text-primary">
                  Explore
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

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


