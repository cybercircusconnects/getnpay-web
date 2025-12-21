"use client"

import type { Shop } from "@/lib/fake-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Star, MapPin, User, DollarSign } from "lucide-react"

interface ShopsGridProps {
  shops: Shop[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

export function ShopsGrid({ shops, currentPage, totalPages, onPageChange }: ShopsGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shops.map((shop) => (
          <Card key={shop.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <Badge variant="outline" className={`absolute top-2 right-2 ${statusColors[shop.status]}`}>
                {shop.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium truncate mb-1">{shop.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{shop.owner}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{shop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{shop.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-bold">{shop.revenueFormatted}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Products</p>
                    <p className="font-medium">{shop.products}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
