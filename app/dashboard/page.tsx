import { StatsCards } from "@/components/dashboard/stats.cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { UsersByRoleChart } from "@/components/dashboard/users-by-role-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { TopProducts } from "@/components/dashboard/top-products"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here{"'"}s an overview of your business.</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <UsersByRoleChart />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentActivity />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <QuickActions />
          <TopProducts />
        </div>
      </div>
    </div>
  )
}
