import { type ReactNode } from "react"
import { Pagination } from "./Pagination"

export type Column<T> = {
  key: keyof T | string
  label: string
  render?: (row: T) => ReactNode
  className?: string
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  loading?: boolean
  pagination?: { page: number; pages: number }
  onPageChange?: (page: number) => void
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
  pagination,
  onPageChange,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-contrast/50 ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-contrast/40"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-contrast/40"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border last:border-b-0 transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-surface" : ""
                }`}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : String(col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && onPageChange && pagination.pages > 1 && (
        <div className="mb-8 border-t border-border">
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
