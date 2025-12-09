"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllStaff } from "@/lib/supabase/staff"
import { getAllProperties } from "@/lib/supabase/properties"
import type { Staff } from "@/lib/types/database"
import type { Property } from "@/lib/types/database"

export default function StaffPage() {
  const [staff, setStaff] = useState<(Staff & { property_name?: string })[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [staffData, propertiesData] = await Promise.all([
          getAllStaff(),
          getAllProperties(),
        ])
        setStaff(staffData)
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching staff:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Staff"
          description="Manage staff members and permissions"
          action={{
            label: "Add New Staff",
            onClick: () => {},
            icon: Plus,
          }}
        />

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <p className="text-muted-foreground">Loading staff...</p>
                    </TableCell>
                  </TableRow>
                ) : staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <p className="text-muted-foreground">No staff members found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                            <AvatarFallback>
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.property_name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "success" : "secondary"}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Staff Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new staff member
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Staff Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

