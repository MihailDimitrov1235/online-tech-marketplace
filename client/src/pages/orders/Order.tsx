import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import Stepper from "@/components/orders/Stepper"
import { paths } from "@/router"
import type { order } from "@/types/order"
import {
  ArrowLeft,
  Store,
  FileText,
  ShieldCheck,
  MapPin,
  Package,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, NavLink } from "react-router"

export default function Order() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<order>()

  useEffect(() => {
    if (id) {
      api
        .get<{ order: order }>(`/orders/${id}`)
        .then(res => {
          setData(res.data.order)
        })
        .catch((err: unknown) => {
          console.log(err)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen pt-10">
      <div className="w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <NavLink
              to={-1 as unknown as string}
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest text-contrast/50 hover:text-contrast transition-colors mb-3"
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back
            </NavLink>
            <h1 className="text-[1.6rem] font-bold tracking-tight text-contrast leading-none">
              Order{" "}
              <span className=" text-contrast/50 text-xl">
                #{id ? id.slice(-8).toUpperCase() : ""}
              </span>
            </h1>
          </div>

          {data && (
            <div className="text-right">
              <p className="text-2xl font-bold text-contrast">
                €{data.total.toFixed(2)}
              </p>
              <p className="text-xs text-contrast/50 mt-0.5">
                {new Date(data.createdAt).toLocaleDateString("en-UK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        <Card>
          <div className="flex w-full items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-neutral flex items-center justify-center">
              <MapPin size={16} className="text-contrast/50" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-contrast/50 mb-1">
                Shipping to
              </p>
              <p className="text-sm font-semibold text-contrast">
                {data?.shippingAddress.street}
              </p>
              <p className="text-sm text-contrast/50 mt-0.5">
                {data?.shippingAddress.city}, {data?.shippingAddress.country}{" "}
                <span className="text-contrast/50">
                  · {data?.shippingAddress.zip}
                </span>
              </p>
            </div>
            <div className="ml-auto">
              <p className="text-xs font-semibold tracking-wide uppercase text-contrast/50 mb-1 text-end">
                Delivered by
              </p>
              <p className="text-sm font-semibold text-contrast text-end">
                {data?.delivery.username}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-5">
            <Package size={15} className="text-contrast/50" />
            <h2 className="text-xs font-semibold tracking-wide uppercase text-contrast/50">
              {data?.items.length ?? 0}{" "}
              {data?.items.length === 1 ? "item" : "items"}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {data?.items.map(item => (
              <Card key={item.product._id} className="flex-col">
                <div className="border-b border-border px-5 py-3">
                  <Stepper status={item.status} />
                </div>

                <div className="flex gap-4 p-5">
                  <NavLink
                    to={paths.listings.details(item.product._id)}
                    className="w-18 h-18 rounded-xl border border-border bg-neutral overflow-hidden hover:border-primary"
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={item.product.images[0]}
                      alt={item.product.name}
                    />
                  </NavLink>

                  <div className="flex flex-1 gap-4 min-w-0">
                    <div className="flex flex-col flex-1 gap-1">
                      <NavLink
                        to={paths.listings.details(item.product._id)}
                        className="text-sm font-semibold text-contrast hover:text-primary"
                      >
                        {item.product.name}
                      </NavLink>
                      <div className="flex items-center gap-1.5 text-xs text-contrast/50 mt-0.5">
                        <Store size={11} />
                        <span>Sold by</span>
                        <NavLink
                          to={paths.home}
                          className="font-medium text-contrast hover:text-primary"
                        >
                          {item.product.seller.username}
                        </NavLink>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-right">
                        <p className="text-sm font-bold text-contrast">
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-contrast/50 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="flex gap-1.5 mt-3">
                        <Button
                          variant="outline"
                          size="xs"
                          className="gap-1 px-2.5 py-1.5 text-[12px] shadow-sm"
                        >
                          Invoice
                          <FileText className="ml-1 mt-0.1" size={10} />
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          className="gap-1 px-2.5 py-1.5 text-[12px] shadow-sm"
                        >
                          Warranty
                          <ShieldCheck className="ml-1 mt-0.1" size={10} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
