import type { order, orderItem, status } from "@/types/order"
import { NavLink } from "react-router"
import { Store } from "lucide-react"
import { paths } from "@/router"
import { orderStatusStyles, nextStatus, type OrderCardVariant } from "./index"
import { Button } from "@/components/common"

type Props = {
  order: order
  variant: OrderCardVariant
  userId?: string
  onChangeItemStatus: (orderId: string, itemId: string, status: status) => void
}

export function OrderCardItems({
  order,
  variant,
  userId,
  onChangeItemStatus,
}: Props) {
  const shouldShowItem = (sellerId: string) => {
    if (variant === "dashboard") {
      return sellerId === userId
    }
    return true
  }

  if (variant === "delivery") {
    const grouped = order.items.reduce<Record<string, orderItem[]>>(
      (acc, item) => {
        const sellerId = item.product.seller._id
        acc[sellerId] ??= []
        acc[sellerId].push(item)
        return acc
      },
      {},
    )

    return (
      <div className="px-6 py-4 flex flex-col gap-4">
        {Object.entries(grouped).map(([sellerId, items]) => (
          <div key={sellerId} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-contrast/50">
              <Store size={12} />
              <span>
                Sold by{" "}
                <span className="font-medium text-contrast">
                  {items[0].product.seller.username}
                </span>
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
              {items.map(i => (
                <div
                  key={i.product._id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <NavLink
                      to={paths.listings.details(i.product._id)}
                      className="w-14 h-14 rounded-xl bg-neutral border border-border  overflow-hidden shrink-0"
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${orderStatusStyles[i.status]}`}
                    >
                      {i.status}
                    </span>
                    {i.status === "pending" ? (
                      <span className="text-xs text-contrast/40 italic">
                        Waiting for confirmation
                      </span>
                    ) : nextStatus[i.status] ? (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          onChangeItemStatus(
                            order._id,
                            i.product._id,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            nextStatus[i.status]!,
                          )
                        }}
                      >
                        Mark as {nextStatus[i.status]}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-4">
      {order.items.map(i => {
        if (!shouldShowItem(i.product.seller._id)) return null
        return (
          <div
            key={i.product._id}
            className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
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
        )
      })}
    </div>
  )
}
