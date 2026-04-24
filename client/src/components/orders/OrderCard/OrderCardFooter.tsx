import type { order, status } from "@/types/order"
import { NavLink } from "react-router"
import { MoveRight } from "lucide-react"
import { paths } from "@/router"
import type { OrderCardVariant } from "./index"
import { Button } from "@/components/common"

type Props = {
  order: order
  variant: OrderCardVariant
  onChangeOrderStatus: (id: string, status: status) => void
}

export function OrderCardFooter({
  order,
  variant,
  onChangeOrderStatus,
}: Props) {
  return (
    <div className="px-6 py-3 border-t bg-surface border-border flex justify-between items-center">
      {variant === "store" && (
        <NavLink to={paths.orders.details(order._id)}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 hover:text-primary"
          >
            View details <MoveRight className="ml-1 mt-0.5" size={12} />
          </Button>
        </NavLink>
      )}

      {variant === "dashboard" && (
        <div className="flex gap-2 ml-auto">
          {order.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="xs"
                className="hover:text-error"
                onClick={() => {
                  onChangeOrderStatus(order._id, "cancelled")
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  onChangeOrderStatus(order._id, "confirmed")
                }}
              >
                Confirm
              </Button>
            </>
          )}
        </div>
      )}

      {variant === "delivery" && (
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-contrast/50">
            <span>Ordered by </span>
            <span className="font-medium text-contrast">
              {order.buyer.username}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
