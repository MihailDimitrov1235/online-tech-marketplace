import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router"
import { Plus, GitFork } from "lucide-react"

import api from "@/api/axiosInstance"
import { Button, Card, TextField } from "@/components/common"
import { Pagination } from "@/components/common/Pagination"
import { paths } from "@/router"
import {
  PART_ICON_COMPONENTS,
  PART_LABELS,
  type PartType,
} from "@/components/configurations/partIcons"
import type { pagination } from "@/types/pagination"
import type { Configuration } from "@/types/configuraion"

function ConfigurationCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 animate-pulse p-4 flex flex-col gap-3">
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-lg bg-zinc-200/80 dark:bg-zinc-700/50"
          />
        ))}
      </div>
      <div className="h-3.5 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-full w-3/4" />
      <div className="h-3 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-full w-1/2" />
      <div className="h-8 bg-zinc-200/80 dark:bg-zinc-700/50 rounded-xl mt-1" />
    </div>
  )
}

function ConfigurationCard({ config }: { config: Configuration }) {
  const preview = [
    config.parts.processor,
    config.parts.gpu ?? config.parts.motherboard,
    config.parts.case ?? config.parts.psu,
  ]

  const partCounts: { type: PartType; count: number }[] = [
    { type: "processor", count: 1 },
    { type: "motherboard", count: 1 },
    { type: "ram", count: config.parts.ram.length },
    { type: "storage", count: config.parts.storage.length },
    { type: "psu", count: 1 },
    ...(config.parts.gpu ? [{ type: "gpu" as const, count: 1 }] : []),
    ...(config.parts.case ? [{ type: "case" as const, count: 1 }] : []),
  ]

  return (
    <NavLink to={paths.configurations.details(config._id)}>
      <Card className="flex-col gap-3 h-full hover:border-primary hover:scale-[1.01] transition-all cursor-pointer relative">
        {config.clonedFrom && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-border text-muted">
            <GitFork size={10} />
            Forked
          </span>
        )}

        <div className="flex gap-2">
          {preview.map((product, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg bg-neutral border border-border overflow-hidden shrink-0"
            >
              <img
                src={product.images[0]}
                className="w-full h-full object-contain p-1"
                alt={product.name}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-contrast">{config.name}</h3>
          {config.description && (
            <p className="text-xs text-muted line-clamp-2">
              {config.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {partCounts.map(({ type, count }) => {
            const Icon = PART_ICON_COMPONENTS[type]
            return (
              <span
                key={type}
                title={PART_LABELS[type]}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-neutral border border-border text-muted"
              >
                <Icon size={12} />
                {count > 1 && `×${String(count)}`}
              </span>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary-tint text-primary-on text-[10px] font-bold uppercase flex items-center justify-center shrink-0 select-none">
              {config.author.username[0]}
            </div>
            <span className="text-xs text-muted">{config.author.username}</span>
          </div>
          <span className="text-sm font-bold text-contrast">
            €{config.totalPrice.toFixed(2)}
          </span>
        </div>
      </Card>
    </NavLink>
  )
}

export default function Configurations() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [requireGpu, setRequireGpu] = useState(false)
  const [requireCase, setRequireCase] = useState(false)
  const [paginationData, setPaginationData] = useState<pagination>({
    total: 0,
    page: 1,
    pages: 1,
  })

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
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      ...(debouncedSearch && { search: debouncedSearch }),
    })
    api
      .get<{ configurations: Configuration[]; pagination: pagination }>(
        `/configurations?${params}`,
      )
      .then(res => {
        setConfigurations(res.data.configurations)
        setPaginationData(res.data.pagination)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, debouncedSearch])

  const hasFilters = requireGpu || requireCase
  const filteredConfigurations = configurations.filter(
    config =>
      (!requireGpu || config.parts.gpu) && (!requireCase || config.parts.case),
  )

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
              Browse configuration templates
            </h1>
            <p className="text-sm text-muted mt-1">
              {loading
                ? "Loading..."
                : `${String(paginationData.total)} configurations`}
            </p>
          </div>
          <NavLink to={paths.configurations.new}>
            <Button variant="primary" size="lg">
              <Plus size={16} className="mr-2" />
              Create configuration
            </Button>
          </NavLink>
        </div>
      </div>

      <div className="px-14 py-8 flex gap-8 items-start">
        <div className="w-72 shrink-0 sticky top-20 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-5 flex flex-col gap-5">
          <TextField
            name="search"
            label="Search"
            fullWidth
            value={searchText}
            onChange={e => {
              setPage(1)
              handleSearchChange(e.target.value)
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Filter by parts
              </p>
              {hasFilters && (
                <button
                  onClick={() => {
                    setRequireGpu(false)
                    setRequireCase(false)
                  }}
                  className="text-xs text-muted hover:text-contrast cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {(
                [
                  { type: "gpu" as const, value: requireGpu, set: setRequireGpu },
                  { type: "case" as const, value: requireCase, set: setRequireCase },
                ]
              ).map(({ type, value, set }) => {
                const Icon = PART_ICON_COMPONENTS[type]
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      onClick={() => {
                        set(v => !v)
                      }}
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                        value
                          ? "bg-primary border-primary"
                          : "border-border group-hover:border-primary-ring"
                      }`}
                    >
                      {value && (
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
                    <Icon size={14} className="text-muted" />
                    <span className="text-sm text-contrast">
                      Has {PART_LABELS[type].toLowerCase()}
                    </span>
                  </label>
                )
              })}
            </div>
            <p className="text-[11px] text-muted/70 mt-3">
              Filters apply to the currently loaded page
            </p>
          </div>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ConfigurationCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredConfigurations.length === 0 ? (
            <Card className="flex-col items-center justify-center py-24 gap-3 text-center">
              <p className="text-contrast/40 text-sm">
                {hasFilters
                  ? "No configurations match these filters"
                  : "No configurations found"}
              </p>
              <NavLink to={paths.configurations.new}>
                <Button variant="outline" size="sm">
                  <Plus size={14} className="mr-1.5" />
                  Be the first to create one
                </Button>
              </NavLink>
            </Card>
          ) : (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {filteredConfigurations.map(config => (
                <ConfigurationCard key={config._id} config={config} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            pages={paginationData.pages}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
