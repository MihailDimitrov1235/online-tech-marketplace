import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { paths } from "@/router"
import type { order } from "@/types/order"
import type { pagination } from "@/types/pagination"
import { MoveRight, ShoppingBag, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router"

export default function MyOrders() {
  const [orders, setOrders] = useState<order[]>([])

  useEffect(() => {
    api
      .get<{ orders: order[]; pagination: pagination }>("/orders")
      .then(res => {
        setOrders(res.data.orders)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [])

  const handleDelete = (id: string) => {
    api
      .delete(`/orders/${id}`)
      .then(() => {
        setOrders(prev => prev.filter(o => o._id !== id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-600",
  }

  return (
    <div className="px-16 pt-10 pb-16 min-h-screen text-contrast">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <span className="text-sm text-contrast">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.length === 0 ? (
        <Card className="flex-col items-center justify-center py-24 gap-4 text-center">
          <ShoppingBag size={40} className="text-contrast/80" />
          <p className="text-contrast text-sm">No orders yet</p>
          <NavLink to={paths.listings.root}>
            <Button variant="primary" size="sm">
              Start shopping
            </Button>
          </NavLink>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(o => (
            <Card key={o._id} className="flex-col gap-0 overflow-hidden p-0">
              {/* Order Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                <div className="flex items-center gap-4">
                  <NavLink
                    to={paths.orders.details(o._id)}
                    className="font-mono text-sm font-semibold hover:text-primary transition-colors"
                  >
                    #{o._id.slice(-8).toUpperCase()}
                  </NavLink>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-contrast/50">
                  <span>
                    {new Date(o.createdAt).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-semibold text-contrast">
                    €{o.total.toFixed(2)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      handleDelete(o._id)
                    }}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 flex flex-col divide-y divide-border">
                {o.items.map(i => (
                  <div
                    key={i.product._id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <NavLink
                        to={paths.listings.details(i.product._id)}
                        className="w-14 h-14 rounded-xl bg-neutral border border-border hover:border-primary-tint overflow-hidden shrink-0"
                      >
                        <img
                          className="w-full h-full object-contain"
                          src={i.product.images[0]}
                          alt={i.product.name}
                        />
                      </NavLink>
                      <div>
                        <NavLink
                          to={paths.listings.details(i.product._id)}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {i.product.name}
                        </NavLink>
                        <p className="text-xs text-contrast/50 mt-0.5">
                          Qty: {i.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      €{(i.product.price * i.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 py-3 border-t bg-surface border-border flex justify-end">
                <NavLink to={paths.orders.details(o._id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 hover:text-primary"
                  >
                    View details <MoveRight size={12} />
                  </Button>
                </NavLink>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
