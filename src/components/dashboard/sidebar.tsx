"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  Package,
  Store,
  Building2,
  Globe,
  Settings,
  Menu,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Shops", href: "/dashboard/shops", icon: Store },
  { name: "Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Countries", href: "/dashboard/countries", icon: Globe },
]

function SidebarContent({ collapsed = false, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4 relative",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-sidebar-border bg-sidebar shadow-sm hover:bg-sidebar-accent z-10"
          >
            <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
        {!collapsed && (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground", onToggle && "ml-7")}>
            <Sparkles className="h-5 w-5" />
          </div>
        )}
        {!collapsed && <span className="font-semibold text-sidebar-foreground">Admin</span>}
      </div>

      <ScrollArea className="flex-1 px-3 py-4 [&>[data-radix-scroll-area-scrollbar]]:hidden">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "flex justify-center")}>
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && "Settings"}
        </Link>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Main navigation menu for the dashboard</SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </aside>
    </>
  )
}
