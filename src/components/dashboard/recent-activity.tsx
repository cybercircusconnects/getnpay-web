"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getRecentActivity } from "@/lib/fake-data"
import { Users, Package, ShoppingCart, Store, CreditCard, Star, Edit } from "lucide-react"

const typeIcons: Record<string, React.ElementType> = {
  user: Users,
  product: Package,
  order: ShoppingCart,
  shop: Store,
  payment: CreditCard,
  review: Star,
}

const typeColors: Record<string, string> = {
  user: "bg-blue-500/10 text-blue-500",
  product: "bg-green-500/10 text-green-500",
  order: "bg-orange-500/10 text-orange-500",
  shop: "bg-purple-500/10 text-purple-500",
  payment: "bg-emerald-500/10 text-emerald-500",
  review: "bg-yellow-500/10 text-yellow-500",
}

export function RecentActivity() {
  const activities = getRecentActivity()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = typeIcons[activity.type] || Edit
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${typeColors[activity.type] || "bg-muted"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
