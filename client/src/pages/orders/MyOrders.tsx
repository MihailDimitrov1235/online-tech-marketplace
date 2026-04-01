import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { paths } from "@/router"
import type { order } from "@/types/order"
import type { pagination } from "@/types/pagination"
import { MoveRight, Trash } from "lucide-react"
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
      .then(res => {
        console.log(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  return (
    <div className="text-contrast px-16 pt-8">
      <span className="text-lg font-bold">Orders</span>
      <Card className="flex-col gap-4 mt-4">
        {orders.map(o => (
          <div
            key={o._id}
            className="w-full not-last:border-b border-border pb-4 flex flex-col gap-4 items-center"
          >
            <div className="flex justify-between w-full">
              <span>Order #{o._id}</span>
              <div className="flex gap-4">
                <span>
                  {new Date(o.createdAt).toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>Total: {o.total}€</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="hover:text-error"
                  onClick={() => {
                    handleDelete(o._id)
                  }}
                >
                  <Trash size={10} />
                </Button>
              </div>
            </div>
            <div className="flex w-full">
              <div className="self-stretch w-px rounded-lg bg-border" />
              <div className="pl-8 flex flex-col gap-4 mt-4 w-full">
                {o.items.map(i => (
                  <div
                    key={i.product._id}
                    className="flex justify-between not-last:border-b border-border pb-4"
                  >
                    <div className="flex gap-4">
                      <img
                        className="w-16 h-16 object-contain rounded-lg"
                        src={i.product.images[0]}
                      />
                      <span>{i.product.name}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span>Price: {i.product.price}€</span>
                      <span>Quantity: {i.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <NavLink to={paths.orders.details(o._id)}>
              <Button variant="ghost" size="sm" className="w-fit">
                <span className="mr-1">Details</span> <MoveRight size={12} />
              </Button>
            </NavLink>
          </div>
        ))}
      </Card>
    </div>
  )
}
