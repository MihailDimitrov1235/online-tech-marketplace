import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router"
import {
  ArrowLeft,
  ShoppingCart,
  Copy,
  Pencil,
  Trash2,
  GitFork,
  Plus,
} from "lucide-react"

import api from "@/api/axiosInstance"
import { paths } from "@/router"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setItems, openCart } from "@/store/cartSlice"
import type { CartItem } from "@/store/cartSlice"
import { Button, Card } from "@/components/common"
import { PART_ICON_COMPONENTS, type PartType } from "@/components/configurations/partIcons"
import type { Configuration } from "@/types/configuraion"
import type { detailedProduct } from "@/types/product"

type PartEntry = { type: PartType; label: string; product: detailedProduct }

export default function ConfigurationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.user)

  const [configuration, setConfiguration] = useState<Configuration>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<{ configuration: Configuration }>(`/configurations/${id}`)
      .then(res => {
        setConfiguration(res.data.configuration)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const isOwner =
    Boolean(configuration) &&
    Boolean(currentUser) &&
    configuration?.author._id === currentUser?._id

  const partEntries: PartEntry[] = []
  if (configuration) {
    partEntries.push({
      type: "processor",
      label: "Processor",
      product: configuration.parts.processor,
    })
    partEntries.push({
      type: "motherboard",
      label: "Motherboard",
      product: configuration.parts.motherboard,
    })
    if (configuration.parts.gpu) {
      partEntries.push({
        type: "gpu",
        label: "Graphics card",
        product: configuration.parts.gpu,
      })
    }
    configuration.parts.ram.forEach((product, i) => {
      partEntries.push({ type: "ram", label: `RAM ${String(i + 1)}`, product })
    })
    configuration.parts.storage.forEach((product, i) => {
      partEntries.push({
        type: "storage",
        label: `Storage ${String(i + 1)}`,
        product,
      })
    })
    partEntries.push({
      type: "psu",
      label: "Power supply",
      product: configuration.parts.psu,
    })
    if (configuration.parts.case) {
      partEntries.push({ type: "case", label: "Case", product: configuration.parts.case })
    }
  }

  const handleAddAllToCart = () => {
    if (!configuration) return
    api
      .post<{ cart: { items: CartItem[] } }>(
        `/configurations/${configuration._id}/buy`,
      )
      .then(res => {
        dispatch(setItems(res.data.cart.items))
        dispatch(openCart())
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const handleClone = () => {
    if (!configuration) return
    api
      .post<{ configuration: Configuration }>(
        `/configurations/${configuration._id}/clone`,
      )
      .then(async res => {
        await navigate(paths.configurations.edit(res.data.configuration._id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const handleDelete = () => {
    if (!configuration) return
    api
      .delete(`/configurations/${configuration._id}`)
      .then(async () => {
        await navigate(paths.configurations.root)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="w-full flex flex-col">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-border px-14 py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-40%] right-[-5%] w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-[-40%] left-[10%] w-48 h-48 rounded-full bg-pink-300/15 dark:bg-pink-600/10 blur-3xl" />
        </div>
        <button
          onClick={() => {
            void navigate(-1)
          }}
          className="relative flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer w-fit mb-4"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-primary-on uppercase tracking-widest mb-1">
              Configuration
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-contrast">
              {configuration?.name ?? (loading ? "Loading..." : "Not found")}
            </h1>
            {configuration && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {partEntries.map(entry => {
                  const Icon = PART_ICON_COMPONENTS[entry.type]
                  return (
                    <span
                      key={`${entry.type}-${entry.product._id}-badge`}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-tint text-primary-on font-medium"
                    >
                      <Icon size={14} />
                      {entry.label}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
          {configuration && (
            <div className="text-right shrink-0">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">
                Total price
              </p>
              <p className="text-3xl font-bold text-contrast">
                {configuration.totalPrice.toFixed(2)}€
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col gap-8 px-14 py-8">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-neutral animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {!loading && !configuration && (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-contrast/40 text-sm">Configuration not found</p>
          <NavLink to={paths.configurations.root}>
            <Button variant="outline" size="sm">
              Back to configurations
            </Button>
          </NavLink>
        </div>
      )}

      {configuration && (
        <div className="flex gap-8 px-14 py-8 items-start">
          <Card className="flex-3 flex-col gap-4 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-contrast">
                Parts breakdown
              </h2>
              <span className="text-xs text-muted">
                {partEntries.length} component{partEntries.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {partEntries.map(entry => {
                const Icon = PART_ICON_COMPONENTS[entry.type]
                return (
                <NavLink
                  key={`${entry.type}-${entry.product._id}`}
                  to={paths.listings.details(entry.product._id)}
                  className="flex items-center gap-4 py-3 group"
                >
                  <span className="w-9 h-9 rounded-xl bg-primary-tint text-primary-on flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </span>

                  <div className="w-12 h-12 rounded-lg bg-neutral border border-border overflow-hidden shrink-0">
                    <img
                      src={entry.product.images[0]}
                      alt={entry.product.name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted uppercase tracking-wide">
                      {entry.label}
                    </p>
                    <p className="text-sm font-medium text-contrast truncate group-hover:text-primary transition-colors">
                      {entry.product.name}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-contrast shrink-0">
                    {entry.product.price}€
                  </p>
                </NavLink>
                )
              })}
            </div>
          </Card>

          <div className="flex-2 flex flex-col gap-4 sticky top-20">
            <Card className="flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-tint text-primary-on text-sm font-bold uppercase flex items-center justify-center shrink-0 select-none">
                  {configuration.author.username[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted">Built by</p>
                  <p className="text-sm font-semibold text-contrast truncate">
                    {configuration.author.username}
                  </p>
                </div>
              </div>

              {configuration.description && (
                <p className="text-sm text-muted">{configuration.description}</p>
              )}

              {configuration.clonedFrom && (
                <NavLink
                  to={paths.configurations.details(configuration.clonedFrom._id)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit"
                >
                  <GitFork size={12} />
                  Forked from {configuration.clonedFrom.name}
                </NavLink>
              )}

              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button
                  onClick={handleAddAllToCart}
                  variant="primary"
                  className="w-full gap-2"
                >
                  <ShoppingCart size={16} />
                  Add all to cart
                </Button>

                <Button
                  onClick={handleClone}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Copy size={16} />
                  Clone & customize
                </Button>

                {isOwner && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        void navigate(paths.configurations.edit(configuration._id))
                      }}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="flex-1 gap-2 text-error"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <NavLink to={paths.configurations.root}>
              <Button variant="ghost" size="sm" className="w-full gap-1.5">
                <Plus size={14} />
                Browse more configurations
              </Button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}
