"use client"

import type { Product } from "@/lib/fake-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  mode: "view" | "edit" | "add"
}

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Food"]
const statuses = ["In Stock", "Low Stock", "Out of Stock", "Discontinued"]

const statusColors: Record<string, string> = {
  "In Stock": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Low Stock": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Out of Stock": "bg-red-500/10 text-red-500 border-red-500/20",
  Discontinued: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function ProductDialog({ open, onOpenChange, product, mode }: ProductDialogProps) {
  const isViewMode = mode === "view"
  const title = mode === "add" ? "Add New Product" : mode === "edit" ? "Edit Product" : "Product Details"

  const handleSave = () => {
    toast.success(mode === "add" ? "Product created successfully" : "Product updated successfully")
    onOpenChange(false)
  }

  if (isViewMode && product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>View product information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="outline" className={statusColors[product.status]}>
                {product.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Price</span>
                <p className="font-bold text-lg">{product.priceFormatted}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Stock</span>
                <p className="font-bold text-lg">{product.stock} units</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new product to your catalog" : "Edit product information"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" defaultValue={product?.name || ""} placeholder="Enter product name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" defaultValue={product?.price || ""} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" defaultValue={product?.stock || ""} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue={product?.category || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={product?.status || "In Stock"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" defaultValue={product?.sku || ""} placeholder="Enter SKU" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{mode === "add" ? "Create Product" : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
