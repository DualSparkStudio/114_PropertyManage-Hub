"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface MemoCardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const MemoCard = memo(function MemoCard({
  title,
  children,
  footer,
  className,
}: MemoCardProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
})

