"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopProducts } from "@/lib/fake-data"

export function TopProducts() {
  const products = getTopProducts()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top Products</CardTitle>
        <CardDescription>Best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales.toLocaleString()} sales</p>
              </div>
              <div className="text-sm font-medium">${(product.revenue / 1000).toFixed(1)}K</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
