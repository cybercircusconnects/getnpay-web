"use client"

import { useState, useMemo } from "react"
import { generateUsers, type User } from "@/lib/fake-data"
import { UsersTable } from "@/components/users/users-table"
import { UsersFilters } from "@/components/users/users-filters"
import { UserDialog } from "@/components/users/user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const allUsers = generateUsers(500)

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "add">("view")
  const pageSize = 10

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [search, roleFilter, statusFilter])

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  const handleView = (user: User) => {
    setSelectedUser(user)
    setDialogMode("view")
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedUser(null)
    setDialogMode("add")
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your user accounts and permissions.</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={allUsers.length}
        filteredCount={filteredUsers.length}
      />

      <UsersTable
        users={paginatedUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
      />

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} mode={dialogMode} />
    </div>
  )
}
