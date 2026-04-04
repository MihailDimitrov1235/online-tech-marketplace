import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import OrderCard from "@/components/orders/OrderCard"
import { paths } from "@/router"
import type { order } from "@/types/order"
import type { pagination } from "@/types/pagination"
import { ShoppingBag } from "lucide-react"
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

  return (
    <div className="px-16 pt-10 pb-16 min-h-screen text-contrast">
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
            <OrderCard order={o} setOrders={setOrders} />
          ))}
        </div>
      )}
    </div>
  )
}
