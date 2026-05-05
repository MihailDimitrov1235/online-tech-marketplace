import api from "@/api/axiosInstance"
import { StatCard } from "@/components/dashboard/StatsCard"
import { useAppSelector } from "@/store/hooks"
import type { Stats } from "@/types/stats"
import {
  ShoppingBag,
  Package,
  Truck,
  Users,
  BadgeCheck,
  TrendingUp,
  ClipboardList,
  Euro,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { user } = useAppSelector(state => state.auth)
  const [stats, setStats] = useState<Stats>({})

  useEffect(() => {
    api
      .get<Stats>("/dashboard/stats")
      .then(res => {
        setStats(res.data)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [])

  return (
    <div className="w-full flex flex-col gap-8 px-14 py-8 text-contrast">
      <div>
        <p className="text-sm text-contrast/50 uppercase tracking-widest mb-1">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}</h1>
      </div>

      {stats.buyer && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/40">
            Purchases
          </h2>
          <div className="flex gap-4">
            <StatCard
              icon={<ShoppingBag size={18} />}
              label="Total Orders"
              value={stats.buyer.totalOrders}
            />
            <StatCard
              icon={<ClipboardList size={18} />}
              label="Pending Orders"
              value={stats.buyer.pendingOrders}
            />
            <StatCard
              icon={<Euro size={18} />}
              label="Total Spent"
              value={`€${stats.buyer.totalSpent.toFixed(2)}`}
            />
          </div>
        </div>
      )}

      {stats.seller && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/40">
            Sales
          </h2>
          <div className="flex gap-4">
            <StatCard
              icon={<Package size={18} />}
              label="Total Products"
              value={stats.seller.totalProducts}
            />
            <StatCard
              icon={<ClipboardList size={18} />}
              label="Total Orders"
              value={stats.seller.totalOrders}
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Pending Orders"
              value={stats.seller.pendingOrders}
            />
            <StatCard
              icon={<Euro size={18} />}
              label="Total Revenue"
              value={`€${stats.seller.totalRevenue.toFixed(2)}`}
            />
          </div>
        </div>
      )}

      {stats.delivery && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/40">
            Deliveries
          </h2>
          <div className="flex gap-4">
            <StatCard
              icon={<Truck size={18} />}
              label="Assigned"
              value={stats.delivery.assigned}
            />
            <StatCard
              icon={<Package size={18} />}
              label="In Progress"
              value={stats.delivery.inProgress}
            />
            <StatCard
              icon={<BadgeCheck size={18} />}
              label="Delivered"
              value={stats.delivery.delivered}
            />
          </div>
        </div>
      )}

      {stats.admin && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/40">
            Platform
          </h2>
          <div className="flex gap-4">
            <StatCard
              icon={<Users size={18} />}
              label="Total Users"
              value={stats.admin.totalUsers}
            />
            <StatCard
              icon={<BadgeCheck size={18} />}
              label="Pending Verifications"
              value={stats.admin.pendingVerifications}
              sub="Sellers awaiting approval"
            />
            <StatCard
              icon={<ClipboardList size={18} />}
              label="Total Orders"
              value={stats.admin.totalOrders}
            />
            <StatCard
              icon={<Package size={18} />}
              label="Total Products"
              value={stats.admin.totalProducts}
            />
          </div>
        </div>
      )}
    </div>
  )
}
