"use client"

import { useState, useMemo } from "react"
import { generateProducts, type Product } from "@/lib/fake-data"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilters } from "@/components/products/products-filters"
import { ProductDialog } from "@/components/products/product-dialog"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const allProducts = generateProducts(300)

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "add">("view")
  const pageSize = viewMode === "grid" ? 12 : 10

  const filteredProducts = useMemo(() => {
    let products = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })

    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "stock":
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return products
  }, [search, categoryFilter, statusFilter, sortBy])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setDialogMode("view")
    setDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setDialogMode("add")
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")} className="hidden sm:block">
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAdd} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <ProductsFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={allProducts.length}
        filteredCount={filteredProducts.length}
      />

      <ProductsGrid
        products={paginatedProducts}
        viewMode={viewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
      />

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={selectedProduct} mode={dialogMode} />
    </div>
  )
}
