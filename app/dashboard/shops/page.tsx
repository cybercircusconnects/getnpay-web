"use client"

import { useState, useMemo } from "react"
import { generateShops, type Shop } from "@/lib/fake-data"
import { ShopsGrid } from "@/components/shops/shops-grid"
import { ShopsFilters } from "@/components/shops/shops-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const allShops = generateShops(100)

export default function ShopsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const filteredShops = useMemo(() => {
    let shops = allShops.filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.owner.toLowerCase().includes(search.toLowerCase()) ||
        shop.location.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || shop.status === statusFilter
      return matchesSearch && matchesStatus
    })

    shops = [...shops].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "revenue-asc":
          return a.revenue - b.revenue
        case "revenue-desc":
          return b.revenue - a.revenue
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return shops
  }, [search, statusFilter, sortBy])

  const paginatedShops = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredShops.slice(start, start + pageSize)
  }, [filteredShops, currentPage, pageSize])

  const totalPages = Math.ceil(filteredShops.length / pageSize)

  const handleAdd = () => {
    console.log("Add shop")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shops</h1>
          <p className="text-muted-foreground">Manage your shop locations and inventory.</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </div>

      <ShopsFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={allShops.length}
        filteredCount={filteredShops.length}
      />

      <ShopsGrid
        shops={paginatedShops}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

