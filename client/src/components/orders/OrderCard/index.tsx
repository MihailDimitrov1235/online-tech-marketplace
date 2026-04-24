import type { order, status } from "@/types/order"
import { useAppSelector } from "@/store/hooks"
import { Card, Button } from "@/components/common"
import { NavLink } from "react-router"
import { Trash } from "lucide-react"
import { paths } from "@/router"
import api from "@/api/axiosInstance"
import { OrderCardItems } from "./OrderCardItems"
import { OrderCardFooter } from "./OrderCardFooter"

export const orderStatusStyles = {
  pending: "bg-order-pending text-order-pending-contrast",
  confirmed: "bg-order-confirmed text-order-confirmed-contrast",
  shipped: "bg-order-shipped text-order-shipped-contrast",
  delivered: "bg-order-delivered text-order-delivered-contrast",
  cancelled: "bg-order-cancelled text-order-cancelled-contrast",
}

export const nextStatus: Partial<Record<status, status>> = {
  confirmed: "shipped",
  shipped: "delivered",
}

export type OrderCardVariant = "dashboard" | "store" | "delivery"

export type OrderCardProps = {
  order: order
  setOrders: React.Dispatch<React.SetStateAction<order[]>>
  variant?: OrderCardVariant
}

export default function OrderCard({
  order,
  setOrders,
  variant = "store",
}: OrderCardProps) {
  const { user } = useAppSelector(state => state.auth)

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

  const handleChangeItemStatus = (
    orderId: string,
    itemId: string,
    status: status,
  ) => {
    api
      .patch(`/orders/${orderId}/items/${itemId}/status`, { status })
      .then(() => {
        setOrders(prev =>
          prev.map(o =>
            o._id === orderId
              ? {
                  ...o,
                  items: o.items.map(i =>
                    i.product._id === itemId ? { ...i, status } : i,
                  ),
                }
              : o,
          ),
        )
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const handleChangeOrderStatus = (id: string, status: status) => {
    api
      .patch(`/orders/${id}/status`, { status })
      .then(() => {
        setOrders(prev => prev.map(o => (o._id === id ? { ...o, status } : o)))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <Card className="flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-4">
          {variant === "store" ? (
            <NavLink
              to={paths.orders.details(order._id)}
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              #{order._id.slice(-8).toUpperCase()}
            </NavLink>
          ) : (
            <span className="text-sm font-semibold">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          )}
          {variant !== "delivery" && (
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${orderStatusStyles[order.status]}`}
            >
              {order.status}
            </span>
          )}
          {variant === "delivery" && (
            <span className="text-xs text-contrast/50">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.country}
            </span>
          )}
        </div>
        <div className="flex items-center gap-6 text-sm text-contrast/60">
          <span>
            {new Date(order.createdAt).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {variant === "store" && (
            <span className="font-semibold text-contrast">
              €{order.total.toFixed(2)}
            </span>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-error transition-colors"
            onClick={() => {
              handleDelete(order._id)
            }}
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>

      <OrderCardItems
        order={order}
        variant={variant}
        userId={user?._id}
        onChangeItemStatus={handleChangeItemStatus}
      />

      <OrderCardFooter
        order={order}
        variant={variant}
        onChangeOrderStatus={handleChangeOrderStatus}
      />
    </Card>
  )
}
