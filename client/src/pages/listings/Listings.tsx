import api from "@/api/axiosInstance"
import { Pagination, TextField } from "@/components/common"
import type { ListingParams } from "@/components/listings/Listing"
import Listing from "@/components/listings/Listing"
import { useState, useEffect, useRef } from "react"

const CONDITIONS = ["used", "refurbished", "new"]

function ListingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-white/10 animate-pulse">
      <div className="aspect-square bg-zinc-200/80 dark:bg-zinc-700/50" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3.5 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-full w-3/4" />
        <div className="h-3 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-full w-1/2" />
        <div className="h-8 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-xl mt-1" />
      </div>
    </div>
  )
}

type Pagination = { total: number; page: number; pages: number }

export default function Listings() {
  const [products, setProducts] = useState<ListingParams[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
  })
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [conditions, setConditions] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const handleSearchChange = (value: string) => {
    setSearchText(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value)
    }, 400)
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (conditions.length > 0) params.set("condition", conditions.join(","))
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)

    api
      .get<{ products: ListingParams[]; pagination: Pagination }>(
        `/products?${params}`,
      )
      .then(res => {
        setProducts(res.data.products)
        setPagination(res.data.pagination)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, debouncedSearch, conditions, minPrice, maxPrice])

  const toggleCondition = (c: string) => {
    setPage(1)
    setConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c],
    )
  }

  const hasFilters = conditions.length > 0 || minPrice || maxPrice

  return (
    <div className="flex flex-col w-full">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-border px-14 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-40%] right-[-5%] w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-[-40%] left-[10%] w-56 h-56 rounded-full bg-pink-300/15 dark:bg-pink-600/10 blur-3xl" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-on uppercase tracking-widest mb-1">
              Marketplace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-contrast">
              Browse listings
            </h1>
            <p className="text-sm text-muted mt-1">
              {loading ? "Loading..." : `${String(pagination.total)} products`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 w-full items-start px-14 pt-8 pb-12">
        <div className="w-80 shrink-0 sticky top-20 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-contrast">Filters</p>
            {hasFilters && (
              <button
                onClick={() => {
                  setPage(1)
                  setConditions([])
                  setMinPrice("")
                  setMaxPrice("")
                }}
                className="text-xs text-muted hover:text-contrast cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">
              Condition
            </p>
            <div className="flex flex-col gap-2">
              {CONDITIONS.map(c => (
                <label
                  key={c}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    onClick={() => {
                      toggleCondition(c)
                    }}
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                      conditions.includes(c)
                        ? "bg-primary border-primary"
                        : "border-border group-hover:border-primary-ring"
                    }`}
                  >
                    {conditions.includes(c) && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 10"
                      >
                        <path
                          d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-contrast">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-3">
              Price range
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => {
                  setPage(1)
                  setMinPrice(e.target.value)
                }}
                className="w-full rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm text-contrast placeholder:text-muted focus:outline-none focus:border-primary-ring"
              />
              <span className="text-muted text-xs shrink-0">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => {
                  setPage(1)
                  setMaxPrice(e.target.value)
                }}
                className="w-full rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-sm text-contrast placeholder:text-muted focus:outline-none focus:border-primary-ring"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <TextField
            placeholder="Search..."
            className="mb-6"
            value={searchText}
            onChange={e => {
              setPage(1)
              handleSearchChange(e.target.value)
            }}
            fullWidth
          />

          <div className="flex-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))
              : products.map(el => (
                  <Listing
                    key={el._id}
                    {...el}
                    activeConditions={conditions}
                    toggleCondition={toggleCondition}
                  />
                ))}
          </div>

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
