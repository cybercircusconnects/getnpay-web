"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Store, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    { label: "Add User", href: "/dashboard/users", icon: UserPlus },
    { label: "Add Product", href: "/dashboard/products", icon: Plus },
    { label: "Add Shop", href: "/dashboard/shops", icon: Store },
    { label: "View Reports", href: "/dashboard", icon: FileText },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button key={action.label} variant="outline" className="h-auto py-3 flex-col gap-1 bg-transparent" asChild>
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
