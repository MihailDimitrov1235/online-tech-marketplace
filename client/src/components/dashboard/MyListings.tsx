import { Pencil, Plus, Trash2, Package } from "lucide-react"
import { Button } from "../common"
import { Card } from "../common/Card"
import { useEffect, useState } from "react"
import api from "@/api/axiosInstance"
import { useAppSelector } from "@/store/hooks"
import { NavLink } from "react-router"
import { paths } from "@/router"
import type { detailedProduct } from "@/types/product"

export default function MyListings() {
  const { user } = useAppSelector(state => state.auth)
  const [products, setProducts] = useState<detailedProduct[]>([])

  useEffect(() => {
    api
      .get<{ products: detailedProduct[] }>("/products", {
        params: { seller: user?._id },
      })
      .then(res => {
        setProducts(res.data.products)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [user])

  const handleDelete = (id: string) => {
    api
      .delete(`/products/${id}`)
      .then(() => {
        setProducts(p => p.filter(el => el._id !== id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="flex flex-col w-full gap-6 text-contrast">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-contrast/50 uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold">My Listings</h1>
        </div>
        <NavLink
          to={
            user?.roles.includes("seller")
              ? paths.dashboard.myListings.new
              : `${paths.settings}?tab=seller`
          }
        >
          <Button variant="primary" size="sm">
            <Plus size={15} className="mr-1.5" />
            Add new listing
          </Button>
        </NavLink>
      </div>

      {products.length === 0 ? (
        <Card className="flex-col items-center justify-center py-24 gap-4 text-center">
          <Package size={40} className="text-contrast/20" />
          <p className="text-contrast/40 text-sm">No listings yet</p>
        </Card>
      ) : (
        <Card className="flex-col p-0 overflow-hidden">
          {products.map((prod, idx) => (
            <div
              key={prod._id}
              className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface ${
                idx !== products.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <NavLink
                  to={paths.dashboard.myListings.details(prod._id)}
                  className="w-16 h-16 rounded-xl bg-neutral border border-border overflow-hidden shrink-0 hover:border-primary"
                >
                  <img
                    className="w-full h-full object-contain"
                    src={prod.images[0]}
                    alt={prod.name}
                  />
                </NavLink>
                <div>
                  <NavLink
                    to={paths.dashboard.myListings.details(prod._id)}
                    className="text-sm font-semibold hover:text-primary truncate"
                  >
                    {prod.name}
                  </NavLink>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-contrast/50 capitalize">
                      {prod.type}
                    </span>
                    <span className="text-contrast/50">·</span>
                    <span className="text-xs text-contrast/50 capitalize">
                      {prod.condition}
                    </span>
                    <span className="text-contrast/50">·</span>
                    <span
                      className={`text-xs font-medium ${prod.stock === 0 ? "text-error" : prod.stock < 5 ? "text-warning" : "text-success"}`}
                    >
                      {prod.stock === 0
                        ? "Out of stock"
                        : `${String(prod.stock)} in stock`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <span className="text-sm font-bold">
                  €{prod.price.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <NavLink to={paths.dashboard.myListings.edit(prod._id)}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:text-primary hover:border-primary"
                    >
                      <Pencil size={14} />
                    </Button>
                  </NavLink>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:text-error hover:border-error"
                    onClick={() => {
                      handleDelete(prod._id)
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
