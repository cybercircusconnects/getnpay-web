"use client"

import type { User } from "@/lib/fake-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  mode: "view" | "edit" | "add"
}

const roles = ["Admin", "User", "Moderator", "Editor", "Viewer", "Manager", "Developer", "Designer"]
const statuses = ["Active", "Inactive", "Pending", "Suspended"]

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Suspended: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function UserDialog({ open, onOpenChange, user, mode }: UserDialogProps) {
  const isViewMode = mode === "view"
  const title = mode === "add" ? "Add New User" : mode === "edit" ? "Edit User" : "User Details"

  const handleSave = () => {
    toast.success(mode === "add" ? "User created successfully" : "User updated successfully")
    onOpenChange(false)
  }

  if (isViewMode && user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>View user information</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{user.role}</Badge>
              <Badge variant="outline" className={statusColors[user.status]}>
                {user.status}
              </Badge>
            </div>
            <div className="w-full space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-sm font-medium">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Join Date</span>
                <span className="text-sm font-medium">{user.joinDate}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new user to the system" : "Edit user information"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name || ""} placeholder="Enter full name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} placeholder="Enter email address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={user?.role || "User"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={user?.status || "Active"}>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{mode === "add" ? "Create User" : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
