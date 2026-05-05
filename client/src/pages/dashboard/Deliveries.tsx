import api from "@/api/axiosInstance"
import { Card } from "@/components/common"
import OrderCard from "@/components/orders/OrderCard"
import type { order } from "@/types/order"
import { PackageCheck } from "lucide-react"
import { useEffect, useState } from "react"

export default function Deliveries() {
  const [orders, setOrders] = useState<order[]>([])

  useEffect(() => {
    api
      .get<{ orders: order[] }>("/dashboard/deliveries")
      .then(res => {
        console.log(res.data)
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
          <h1 className="text-3xl font-bold">Deliveries</h1>
        </div>
        <span className="text-sm text-contrast/50 ">
          {orders.length} deliver{orders.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      {orders.length === 0 ? (
        <Card className="flex-col items-center justify-center py-24 gap-4 text-center">
          <PackageCheck size={40} className="text-contrast/50" />
          <p className="text-contrast/50 text-sm">No deliveries yet</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map(o => (
            <OrderCard
              key={o._id}
              order={o}
              setOrders={setOrders}
              variant="delivery"
            />
          ))}
        </div>
      )}
    </div>
  )
}
