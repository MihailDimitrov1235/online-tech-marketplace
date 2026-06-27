import { useEffect, useRef, useState } from "react"
import { Plus, X, ChevronUp } from "lucide-react"
import api from "@/api/axiosInstance"
import { Button, Card, TextField, Pagination } from "@/components/common"
import type { detailedProduct } from "@/types/product"
import type { pagination } from "@/types/pagination"

type PartPickerProps = {
  type: string
  label: string
  multiple?: boolean
  selected: detailedProduct[]
  onChange: (next: detailedProduct[]) => void
}

export function PartPicker({
  type,
  label,
  multiple = false,
  selected,
  onChange,
}: PartPickerProps) {
  const [expanded, setExpanded] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<detailedProduct[]>([])
  const [paginationData, setPaginationData] = useState<pagination>({
    total: 0,
    page: 1,
    pages: 1,
  })
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const handleSearchChange = (value: string) => {
    setSearchText(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(value)
    }, 400)
  }

  useEffect(() => {
    if (!expanded) return
    setLoading(true)
    const params = new URLSearchParams({
      type,
      page: String(page),
      ...(debouncedSearch && { search: debouncedSearch }),
    })
    api
      .get<{ products: detailedProduct[]; pagination: pagination }>(
        `/products?${params}`,
      )
      .then(res => {
        setResults(res.data.products)
        setPaginationData(res.data.pagination)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [expanded, type, page, debouncedSearch])

  const isSelected = (id: string) => selected.some(p => p._id === id)

  const handlePick = (product: detailedProduct) => {
    if (multiple) {
      if (isSelected(product._id)) return
      onChange([...selected, product])
    } else {
      onChange([product])
      setExpanded(false)
    }
  }

  const handleRemove = (id: string) => {
    onChange(selected.filter(p => p._id !== id))
  }

  return (
    <Card size="sm" className="flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-contrast">{label}</p>
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => {
            setExpanded(e => !e)
          }}
        >
          {expanded ? (
            <>
              Close
              <ChevronUp size={14} className="ml-1" />
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" />
              {multiple || selected.length === 0 ? "Add" : "Change"}
            </>
          )}
        </Button>
      </div>

      {selected.length === 0 && !expanded && (
        <p className="text-xs text-muted">Nothing selected yet</p>
      )}

      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          {selected.map(product => (
            <div
              key={product._id}
              className="flex items-center gap-3 p-2 rounded-lg border border-border bg-neutral"
            >
              <div className="w-10 h-10 rounded-md bg-white border border-border overflow-hidden shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-contrast truncate">
                  {product.name}
                </p>
                <p className="text-xs text-muted">{product.price}€</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleRemove(product._id)
                }}
                className="text-muted hover:text-error shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {expanded && (
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <TextField
            placeholder={`Search ${label.toLowerCase()}...`}
            fullWidth
            value={searchText}
            onChange={e => {
              handleSearchChange(e.target.value)
            }}
          />

          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg bg-neutral animate-pulse"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-xs text-muted text-center py-4">
              No {label.toLowerCase()} found
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {results.map(product => {
                const picked = isSelected(product._id)
                return (
                  <button
                    type="button"
                    key={product._id}
                    onClick={() => {
                      handlePick(product)
                    }}
                    disabled={picked}
                    className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      picked
                        ? "border-primary bg-primary-tint cursor-default"
                        : "border-border hover:border-primary-ring"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-md bg-white border border-border overflow-hidden shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-contrast truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted">
                        {product.price}€ · {product.condition}
                      </p>
                    </div>
                    {picked && (
                      <span className="text-xs text-primary-on shrink-0">
                        Selected
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          <Pagination
            page={paginationData.page}
            pages={paginationData.pages}
            onChange={setPage}
          />
        </div>
      )}
    </Card>
  )
}
