import { MainLayout } from "@/components/layout/main-layout"
import { PageHeader } from "@/components/reusable/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { RevenueChart } from "@/components/reusable/revenue-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const paymentLogs = [
  {
    id: "1",
    date: "2024-01-15",
    guest: "John Doe",
    property: "Grand Hotel",
    amount: "$450",
    status: "Paid",
    method: "Credit Card",
  },
  {
    id: "2",
    date: "2024-01-16",
    guest: "Jane Smith",
    property: "Beach Resort",
    amount: "$600",
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    id: "3",
    date: "2024-01-17",
    guest: "Mike Johnson",
    property: "Mountain Villa",
    amount: "$380",
    status: "Paid",
    method: "PayPal",
  },
]

export default function FinancePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Finance"
          description="Track revenue, payments, and financial reports"
        />

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Logs</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentLogs.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="font-medium">
                        {payment.guest}
                      </TableCell>
                      <TableCell>{payment.property}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "Paid" ? "success" : "warning"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Payouts */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Airbnb Payout</p>
                      <p className="text-sm text-muted-foreground">
                        Due: Jan 20, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$12,450</p>
                      <Badge variant="warning" className="mt-1">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking.com Payout</p>
                      <p className="text-sm text-muted-foreground">
                        Due: Jan 22, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$8,200</p>
                      <Badge variant="warning" className="mt-1">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Taxes & Settlements */}
        <Card>
          <CardHeader>
            <CardTitle>Taxes & Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-xl">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-2">$124,500</p>
              </div>
              <div className="p-4 border rounded-xl">
                <p className="text-sm text-muted-foreground">Taxes</p>
                <p className="text-2xl font-bold mt-2">$12,450</p>
              </div>
              <div className="p-4 border rounded-xl">
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold mt-2">$112,050</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

