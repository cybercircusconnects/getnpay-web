"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface CountriesFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  regionFilter: string
  onRegionFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  totalCount: number
  filteredCount: number
}

export function CountriesFilters({
  search,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
}: CountriesFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search countries by name, capital, or code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={regionFilter} onValueChange={onRegionFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
            <SelectItem value="Americas">Americas</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Oceania">Oceania</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="population-desc">Population: High to Low</SelectItem>
            <SelectItem value="population-asc">Population: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} countries
      </p>
    </div>
  )
}

