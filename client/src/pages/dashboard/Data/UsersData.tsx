// dashboard/data/Users.tsx
import { useEffect, useState } from "react"
import { Table, type Column } from "@/components/common/Table"
import type { User } from "@/types/auth"
import api from "@/api/axiosInstance"
import type { pagination } from "@/types/pagination"

const columns: Column<User>[] = [
  {
    key: "_id",
    label: "ID",
    render: row => (
      <span className="font-mono text-xs text-contrast/50">
        {row._id.slice(-8).toUpperCase()}
      </span>
    ),
  },
  {
    key: "username",
    label: "Username",
    render: row => <span className="font-medium">{row.username}</span>,
  },
  {
    key: "firstName",
    label: "Name",
    render: row => `${row.firstName} ${row.lastName}`,
  },
  {
    key: "roles",
    label: "Roles",
    render: row => (
      <div className="flex gap-1 flex-wrap">
        {row.roles.map(role => (
          <span
            key={role}
            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize"
          >
            {role}
          </span>
        ))}
      </div>
    ),
  },
]

export default function UsersData() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const fetchUsers = (page: number) => {
    setLoading(true)
    api
      .get<{ users: User[]; pagination: pagination }>(
        `/users?page=${String(page)}`,
      )
      .then(res => {
        setUsers(res.data.users)
        setPages(res.data.pagination.pages)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  return (
    <Table
      columns={columns}
      data={users}
      keyExtractor={row => row._id}
      loading={loading}
      emptyMessage="No users found"
      pagination={{ page, pages }}
      onPageChange={setPage}
    />
  )
}
