import api from "@/api/axiosInstance"
import type { ListingParams } from "@/components/listings/Listing"
import Listing from "@/components/listings/Listing"
import { useState, useEffect } from "react"

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

export default function Listings() {
  const [products, setProducts] = useState<ListingParams[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{
        products: ListingParams[]
      }>("/products")
      .then(res => {
        setProducts(res.data.products)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
              {products.length} products available
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 w-full items-start px-14 pt-8">
        <div className="w-56 shrink-0 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-sm p-5">
          <p className="text-sm font-semibold text-contrast mb-4">Filters</p>
          <p className="text-xs text-muted">Coming soon</p>
        </div>

        <div className="flex-1 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ListingSkeleton key={i} />
              ))
            : products.map(el => <Listing key={el._id} {...el} />)}
        </div>
      </div>
    </div>
  )
}
