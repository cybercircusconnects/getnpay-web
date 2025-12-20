"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/fake-data"
import { Users, DollarSign, Store, Package, TrendingUp, TrendingDown } from "lucide-react"

export function StatsCards() {
  const stats = getDashboardStats()

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: stats.userGrowth,
      icon: Users,
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      change: stats.revenueGrowth,
      icon: DollarSign,
    },
    {
      title: "Active Shops",
      value: stats.activeShops.toLocaleString(),
      change: stats.shopGrowth,
      icon: Store,
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: stats.productGrowth,
      icon: Package,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {card.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={card.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                {card.change >= 0 ? "+" : ""}
                {card.change}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
