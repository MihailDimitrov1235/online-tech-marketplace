import api from "@/api/axiosInstance"
import { Button, Card } from "@/components/common"
import type { pagination } from "@/types/pagination"
import { Pagination } from "@/components/common/Pagination"
import {
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  Mail,
  Ban,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { Seller } from "@/types/seller"

export default function Verification() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [paginationData, setPaginationData] = useState<pagination>({
    total: 0,
    page: 1,
    pages: 1,
  })

  const fetchSellers = (page: number) => {
    setLoading(true)
    api
      .get<{ sellers: Seller[]; pagination: pagination }>(
        `/sellers/unverified?page=${String(page)}`,
      )
      .then(res => {
        setSellers(res.data.sellers)
        setPaginationData(res.data.pagination)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSellers(page)
  }, [page])

  const handleVerify = (id: string) => {
    api
      .patch(`/sellers/${id}/verify`)
      .then(() => {
        setSellers(prev => prev.filter(s => s._id !== id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }
  const handleReject = (id: string) => {
    api
      .delete(`/sellers/${id}/reject`)
      .then(() => {
        setSellers(prev => prev.filter(s => s._id !== id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const resolutionLabels: Record<string, string> = {
    repair: "Repair only",
    repair_replace: "Repair or Replace",
    full: "Full (incl. refund)",
  }

  return (
    <div className="w-full flex flex-col gap-4 px-14 py-8 text-contrast">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-contrast/50 uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold">Verification Requests</h1>
        </div>
        <span className="text-sm text-contrast/50">
          {paginationData.total} pending
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-neutral animate-pulse" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <Card className="flex-col items-center justify-center py-24 gap-3 text-center">
          <BadgeCheck size={40} className="text-success" />
          <p className="text-contrast/50 text-sm">All sellers are verified</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {sellers.map(seller => (
            <Card
              key={seller._id}
              className="flex-col gap-0 p-0 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-primary-tint text-primary-on 
                            border-primary-tint-border hover:bg-primary-tint-hover text-xs 
                              font-bold flex items-center justify-center select-none"
                  >
                    <span className="uppercase">
                      {seller.user.firstName[0]}
                    </span>
                    <span className="uppercase">{seller.user.lastName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {seller.user.firstName} {seller.user.lastName}
                    </p>
                    <p className="text-xs text-contrast/50">
                      @{seller.user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-contrast/50">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(seller.createdAt).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      variant="ghost"
                      className="hover:text-error"
                      onClick={() => {
                        handleReject(seller._id)
                      }}
                    >
                      <Ban size={14} className="mr-1.5" />
                      Reject
                    </Button>
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => {
                        handleVerify(seller._id)
                      }}
                    >
                      <BadgeCheck size={14} className="mr-1.5" />
                      Verify
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-contrast/40">
                    Contact
                  </p>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Mail size={13} className="text-contrast/40 shrink-0" />
                    {seller.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone size={13} className="text-contrast/40 shrink-0" />
                    {seller.phone}
                  </div>
                  <div className="flex items-start gap-1.5 text-sm">
                    <MapPin
                      size={13}
                      className="text-contrast/40 shrink-0 mt-0.5"
                    />
                    <span>
                      {seller.address.street}, {seller.address.city},{" "}
                      {seller.address.zip}, {seller.address.country}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-contrast/40">
                    Warranty
                  </p>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-contrast/50">Duration</span>
                      <span className="font-medium">
                        {seller.warranty.durationMonths} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-contrast/50">Resolution</span>
                      <span className="font-medium">
                        {resolutionLabels[seller.warranty.resolution]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-contrast/50">Shipping</span>
                      <span className="font-medium capitalize">
                        {seller.warranty.shipping}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-contrast/40">
                    Coverage
                  </p>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        size={13}
                        className={
                          seller.warranty.accidentalDamage
                            ? "text-success"
                            : "text-contrast/20"
                        }
                      />
                      <span
                        className={
                          seller.warranty.accidentalDamage
                            ? ""
                            : "text-contrast/40"
                        }
                      >
                        Accidental damage
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        size={13}
                        className={
                          seller.warranty.wearAndTear
                            ? "text-success"
                            : "text-contrast/20"
                        }
                      />
                      <span
                        className={
                          seller.warranty.wearAndTear ? "" : "text-contrast/40"
                        }
                      >
                        Wear & tear
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} pages={paginationData.pages} onChange={setPage} />
    </div>
  )
}
