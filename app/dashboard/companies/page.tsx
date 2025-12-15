"use client"

import { useState, useMemo } from "react"
import { generateCompanies, type Company } from "@/lib/fake-data"
import { CompaniesGrid } from "@/components/companies/companies-grid"
import { CompaniesFilters } from "@/components/companies/companies-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const allCompanies = generateCompanies(50)

export default function CompaniesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const filteredCompanies = useMemo(() => {
    let companies = allCompanies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase()) ||
        company.country.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || company.status === statusFilter
      return matchesSearch && matchesStatus
    })

    companies = [...companies].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "revenue-desc":
          return b.revenue - a.revenue
        case "revenue-asc":
          return a.revenue - b.revenue
        case "employees":
          return b.employees - a.employees
        default:
          return 0
      }
    })

    return companies
  }, [search, statusFilter, sortBy])

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCompanies.slice(start, start + pageSize)
  }, [filteredCompanies, currentPage, pageSize])

  const totalPages = Math.ceil(filteredCompanies.length / pageSize)

  const handleAdd = () => {
    console.log("Add company")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage company information and partnerships.</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      <CompaniesFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={allCompanies.length}
        filteredCount={filteredCompanies.length}
      />

      <CompaniesGrid
        companies={paginatedCompanies}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

