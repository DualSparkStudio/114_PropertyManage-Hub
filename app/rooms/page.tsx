import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const rooms = [
  {
    id: "1",
    roomNo: "201",
    property: "Grand Hotel",
    type: "Deluxe",
    price: "$150",
    status: "Available",
    cleanliness: "Clean",
  },
  {
    id: "2",
    roomNo: "202",
    property: "Grand Hotel",
    type: "Standard",
    price: "$120",
    status: "Occupied",
    cleanliness: "Clean",
  },
  {
    id: "3",
    roomNo: "203",
    property: "Grand Hotel",
    type: "Suite",
    price: "$250",
    status: "Maintenance",
    cleanliness: "Dirty",
  },
  {
    id: "4",
    roomNo: "305",
    property: "Beach Resort",
    type: "Deluxe",
    price: "$180",
    status: "Available",
    cleanliness: "Clean",
  },
  {
    id: "5",
    roomNo: "306",
    property: "Beach Resort",
    type: "Standard",
    price: "$140",
    status: "Occupied",
    cleanliness: "Clean",
  },
]

export default function RoomsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Rooms"
          description="Manage all rooms across properties"
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search rooms..." />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="1">Grand Hotel</SelectItem>
                <SelectItem value="2">Beach Resort</SelectItem>
                <SelectItem value="3">Mountain Villa</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cleanliness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="dirty">Dirty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Rooms Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room No</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cleanliness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNo}</TableCell>
                    <TableCell>{room.property}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.status === "Available"
                            ? "success"
                            : room.status === "Occupied"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={room.cleanliness === "Clean" ? "success" : "warning"}
                      >
                        {room.cleanliness}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

