import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router"
import { ArrowLeft, ShoppingCart, Copy, Pencil, Trash2 } from "lucide-react"

import api from "@/api/axiosInstance"
import { paths } from "@/router"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setItems, openCart } from "@/store/cartSlice"
import type { CartItem } from "@/store/cartSlice"
import { Button, Card } from "@/components/common"
import type { Configuration } from "@/types/configuraion"
import type { detailedProduct } from "@/types/product"

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

  const partEntries: { label: string; product: detailedProduct }[] = []
  if (configuration) {
    partEntries.push({
      label: "Processor",
      product: configuration.parts.processor,
    })
    partEntries.push({
      label: "Motherboard",
      product: configuration.parts.motherboard,
    })
    if (configuration.parts.gpu) {
      partEntries.push({ label: "Graphics card", product: configuration.parts.gpu })
    }
    configuration.parts.ram.forEach((product, i) => {
      partEntries.push({ label: `RAM ${String(i + 1)}`, product })
    })
    configuration.parts.storage.forEach((product, i) => {
      partEntries.push({ label: `Storage ${String(i + 1)}`, product })
    })
    partEntries.push({ label: "Power supply", product: configuration.parts.psu })
    if (configuration.parts.case) {
      partEntries.push({ label: "Case", product: configuration.parts.case })
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
        <div className="relative">
          <p className="text-xs font-medium text-primary-on uppercase tracking-widest mb-1">
            Configuration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-contrast">
            {configuration?.name ?? (loading ? "Loading..." : "Not found")}
          </h1>
        </div>
      </div>

      {configuration && (
        <div className="flex flex-col gap-8 px-14 py-8">
          <div className="w-full flex gap-8">
            <Card className="flex-2 flex-col gap-4">
              {configuration.description && (
                <p className="text-sm text-muted">{configuration.description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">
                  by {configuration.author.username}
                </span>
                {configuration.clonedFrom && (
                  <NavLink
                    to={paths.configurations.details(configuration.clonedFrom._id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Forked from {configuration.clonedFrom.name}
                  </NavLink>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted">Total price</span>
                <span className="text-2xl font-bold text-contrast">
                  {configuration.totalPrice.toFixed(2)}€
                </span>
              </div>

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
            </Card>
          </div>

          <Card className="flex-col gap-4">
            <h2 className="text-2xl font-bold text-contrast">Parts</h2>
            <div className="grid grid-cols-3 gap-4">
              {partEntries.map(({ label, product }) => (
                <NavLink
                  key={`${label}-${product._id}`}
                  to={paths.listings.details(product._id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary-ring transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-neutral border border-border overflow-hidden shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-contrast truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted">{product.price}€</p>
                  </div>
                </NavLink>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
