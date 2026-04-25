import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  page: number
  pages: number
  onChange: (page: number) => void
}

export function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null

  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)

    if (page <= 4) return [1, 2, 3, 4, 5, "...", pages]
    if (page >= pages - 3)
      return [1, "...", pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, "...", page - 1, page, page + 1, "...", pages]
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => {
          onChange(page - 1)
        }}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${String(i)}`}
            className="w-8 h-8 flex items-center justify-center text-sm text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => {
              onChange(p as number)
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              page === p
                ? "bg-primary text-primary-contrast"
                : "text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => {
          onChange(page + 1)
        }}
        disabled={page === pages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
