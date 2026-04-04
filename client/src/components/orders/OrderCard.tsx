import api from "@/api/axiosInstance"
import type { order } from "@/types/order"
import { NavLink } from "react-router"
import { Button, Card } from "../common"
import { paths } from "@/router"
import { MoveRight, Trash } from "lucide-react"

export default function OrderCard({
  order,
  setOrders,
  variant = "store",
}: {
  order: order
  setOrders: React.Dispatch<React.SetStateAction<order[]>>
  variant?: "dashboard" | "store"
}) {
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
  // TODO: Make card depend on variant
  return (
    <Card key={order._id} className="flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-4">
          <NavLink
            to={paths.orders.details(order._id)}
            className="font-mono text-sm font-semibold hover:text-primary transition-colors"
          >
            #{order._id.slice(-8).toUpperCase()}
          </NavLink>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-contrast/60">
          <span>
            {new Date(order.createdAt).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="font-semibold text-contrast">
            €{order.total.toFixed(2)}
          </span>
          {/* TODO: Remove button when its not needed for testing anymore or make it visible only on finished/canceled orders*/}
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => {
              handleDelete(order._id)
            }}
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col divide-y divide-border">
        {order.items.map(i => (
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
                <p className="text-xs text-contrast/60 mt-0.5">
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

      <div className="px-6 py-3 border-t bg-surface border-border flex justify-end">
        <NavLink to={paths.orders.details(order._id)}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 hover:text-primary"
          >
            View details <MoveRight className="ml-1 mt-0.5" size={12} />
          </Button>
        </NavLink>
      </div>
    </Card>
  )
}
