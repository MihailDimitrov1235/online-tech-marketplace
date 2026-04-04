import api from "@/api/axiosInstance"
import { Card } from "@/components/common"
import OrderCard from "@/components/orders/OrderCard"
import type { order } from "@/types/order"
import { PackageCheck } from "lucide-react"
import { useEffect, useState } from "react"

export default function Orders() {
  const [orders, setOrders] = useState<order[]>([])

  useEffect(() => {
    api
      .get<{ orders: order[] }>("/dashboard/orders")
      .then(res => {
        setOrders(res.data.orders)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [])

  return (
    <div className="w-full flex flex-col gap-4 px-14 py-8 text-contrast">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-contrast/50 uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
        <span className="text-sm text-contrast/50 ">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.length === 0 ? (
        <Card className="flex-col items-center justify-center py-24 gap-4 text-center">
          <PackageCheck size={40} className="text-contrast/50" />
          <p className="text-contrast/50 text-sm">No orders yet</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(o => (
            <OrderCard order={o} setOrders={setOrders} />
          ))}
        </div>
      )}
    </div>
  )
}
