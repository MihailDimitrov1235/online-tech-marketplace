import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import { paths } from "@/router"
import type { order } from "@/types/order"
import {
  Check,
  Package,
  PackageCheck,
  Truck,
  File,
  MoveLeft,
  Store,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, NavLink } from "react-router"
import { twMerge } from "tailwind-merge"

const steps = [
  {
    step: "pending",
    label: "Confirmed",
    text: "Order placed and confirmed",
    icon: <File />,
  },
  {
    step: "confirmed",
    label: "Processing",
    text: "Preparing your items",
    icon: <Package />,
  },
  {
    step: "shipped",
    label: "Shipped",
    text: "Order on the way",
    icon: <Truck />,
  },
  {
    step: "delivered",
    label: "Delivered",
    text: "Order received",
    icon: <PackageCheck />,
  },
]

export default function Order() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<order>()
  const stepOrder = ["pending", "confirmed", "shipped", "delivered"]
  const currentStepIndex = stepOrder.indexOf(data ? data.status : "pending")
  useEffect(() => {
    if (id) {
      api
        .get<{ order: order }>(`/orders/${id}`)
        .then(res => {
          setData(res.data.order)
          console.log(res.data.order)
        })
        .catch((err: unknown) => {
          console.log(err)
        })
    }
  }, [id])
  return (
    <div className="px-16 pt-10 pb-16 min-h-screen text-contrast">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Order #{id ? id.slice(-8).toUpperCase() : ""}
        </h1>
        <NavLink to={-1 as unknown as string}>
          <Button variant={"ghost"} size="sm">
            <MoveLeft className="mt-0.5 mr-1" size={16} />
            Back
          </Button>
        </NavLink>
      </div>
      <Card className="flex-col gap-4">
        <div className="flex w-full justify-between">
          <h1 className="font-bold text-xl">Info</h1>
          {data && (
            <div className="flex items-center gap-6 text-sm text-contrast/60">
              <span>
                {new Date(data.createdAt).toLocaleDateString("en-UK", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="font-semibold text-contrast">
                €{data.total.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <ol className="flex items-center w-full mb-4">
          {steps.map(({ step, label, text, icon }, i) => {
            const isCompleted = i <= currentStepIndex
            const isLast = i === steps.length - 1

            return (
              <li
                key={step}
                className={twMerge(
                  "flex items-center",
                  !isLast &&
                    "flex-1 after:block after:h-0.5 after:bg-border after:flex-1 after:mx-2",
                )}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${isCompleted ? "bg-primary text-primary-contrast shadow-md shadow-primary/30" : "border-2 border-border"} `}
                  >
                    {isCompleted ? <Check /> : icon}
                  </span>
                  <span className="flex flex-col items-center text-center">
                    <h3
                      className={twMerge(
                        "text-sm font-semibold leading-tight",
                        isCompleted ? "text-primary" : "text-contrast",
                      )}
                    >
                      {label}
                    </h3>
                    <p
                      className={twMerge(
                        "text-xs mt-0.5",
                        isCompleted ? "text-contrast/90" : "text-contrast/60",
                      )}
                    >
                      {text}
                    </p>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Items</h1>
            <div className="flex flex-col divide-y divide-border">
              {data?.items.map(item => (
                <div
                  key={item.product._id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <NavLink
                    to={paths.listings.details(item.product._id)}
                    className="w-20 h-20 rounded-xl bg-neutral border border-border hover:border-primary transition-colors overflow-hidden"
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={item.product.images[0]}
                    />
                  </NavLink>

                  <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <NavLink
                      to={paths.listings.details(item.product._id)}
                      className="text-sm font-semibold hover:text-primary transition-colors truncate"
                    >
                      {item.product.name}
                    </NavLink>

                    <div className="flex items-center gap-1.5 text-xs text-contrast/60 mt-1">
                      <Store size={12} />
                      <span>
                        <span className="mr-1">Sold by</span>
                        <NavLink
                          to={paths.home}
                          // TODO: send to seller profile or listings by seller
                          className="font-medium text-contrast hover:text-primary transition-colors"
                        >
                          {item.product.seller.username}
                        </NavLink>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                    <span className="text-xs text-contrast/60">
                      Qnt: {item.quantity}
                    </span>

                    {/* TODO: add product invoice and warranty functionality */}
                    <div className="flex gap-1.5 mt-2">
                      <Button
                        variant="outline"
                        size="xs"
                        className="flex items-center"
                      >
                        <span>Invoice</span>
                        <FileText className="mt-1 ml-1" size={11} />
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        className="flex items-center"
                      >
                        <span>Warranty</span>
                        <ShieldCheck className="mt-1 ml-1" size={11} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
