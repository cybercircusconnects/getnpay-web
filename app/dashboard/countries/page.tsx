"use client"

import { useState, useMemo } from "react"
import { allCountries, type Country } from "@/lib/fake-data"
import { CountriesGrid } from "@/components/countries/countries-grid"
import { CountriesFilters } from "@/components/countries/countries-filters"

export default function CountriesPage() {
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const filteredCountries = useMemo(() => {
    let countries = allCountries.filter((country) => {
      const matchesSearch =
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.capital.toLowerCase().includes(search.toLowerCase()) ||
        country.code.toLowerCase().includes(search.toLowerCase())
      const matchesRegion = regionFilter === "all" || country.region === regionFilter
      return matchesSearch && matchesRegion
    })

    countries = [...countries].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "population-desc":
          return b.population - a.population
        case "population-asc":
          return a.population - b.population
        default:
          return 0
      }
    })

    return countries
  }, [search, regionFilter, sortBy])

  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCountries.slice(start, start + pageSize)
  }, [filteredCountries, currentPage, pageSize])

  const totalPages = Math.ceil(filteredCountries.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Countries</h1>
          <p className="text-muted-foreground">Browse country information and statistics.</p>
        </div>
      </div>

      <CountriesFilters
        search={search}
        onSearchChange={setSearch}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={allCountries.length}
        filteredCount={filteredCountries.length}
      />

      <CountriesGrid
        countries={paginatedCountries}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

