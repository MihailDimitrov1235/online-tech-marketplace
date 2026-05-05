import api from "@/api/axiosInstance"
import { Button, Card, TextField } from "@/components/common"
import { paths } from "@/router"
import type { pagination } from "@/types/pagination"
import { Cpu, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router"
import { Pagination } from "@/components/common/Pagination"
import type { Configuration } from "@/types/configuraion"

export default function Configurations() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [paginationData, setPaginationData] = useState<pagination>({
    total: 0,
    page: 1,
    pages: 1,
  })

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      ...(search && { search }),
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
  }, [page, search])

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

      <div className="px-14 py-8 flex flex-col gap-6">
        <TextField
          name="search"
          label="Search"
          fullWidth
          value={search}
          onChange={e => {
            setSearch(e.target.value)
          }}
        />

        <Card className="flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Filter by parts included
          </p>
        </Card>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-neutral animate-pulse"
              />
            ))}
          </div>
        ) : configurations.length === 0 ? (
          <Card className="flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-contrast/40 text-sm">No configurations found</p>
            <NavLink to={paths.configurations.new}>
              <Button variant="outline" size="sm">
                <Plus size={14} className="mr-1.5" />
                Be the first to create one
              </Button>
            </NavLink>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {configurations.map(config => (
              <NavLink
                key={config._id}
                to={paths.configurations.details(config._id)}
              >
                <Card className="flex-col gap-3 h-full hover:border-primary transition-colors cursor-pointer">
                  <div className="flex gap-1.5">
                    <div className="w-12 h-12 rounded-lg bg-neutral border border-border overflow-hidden">
                      <img
                        src={config.parts.processor.images[0]}
                        className="w-full h-full object-contain p-0.5"
                        alt={config.parts.processor.name}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-contrast">
                      {config.name}
                    </h3>
                    {config.description && (
                      <p className="text-xs text-muted line-clamp-2">
                        {config.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-neutral border border-border capitalize text-muted">
                      <Cpu />
                      {config.parts.processor.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted">
                      by {config.author.username}
                    </span>
                    <span className="text-sm font-bold">
                      €{config.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </Card>
              </NavLink>
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
  )
}
