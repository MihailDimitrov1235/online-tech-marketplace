import { NavLink } from "react-router"
import { twMerge } from "tailwind-merge"
import {
  ChartColumnIncreasing,
  Truck,
  Home,
  Package,
  ClipboardList,
  ShieldQuestionMark,
  Database,
} from "lucide-react"
import { Logo } from "../common"
import { paths } from "@/router"

export default function Sidebar() {
  const dashboardRoutes = [
    {
      path: paths.dashboard.root,
      label: "Dashboard",
      icon: <ChartColumnIncreasing size={18} />,
    },
    {
      path: paths.dashboard.myListings.root,
      label: "My Listings",
      icon: <Package size={18} />,
    },
    {
      path: paths.dashboard.orders.root,
      label: "Orders",
      icon: <ClipboardList size={18} />,
    },
    {
      path: paths.dashboard.deliveries.root,
      label: "Deliveries",
      icon: <Truck size={18} />,
    },
    {
      path: paths.dashboard.data.root,
      label: "Data",
      icon: <Database size={18} />,
    },
    {
      path: paths.dashboard.verifications.root,
      label: "Verification requests",
      icon: <ShieldQuestionMark size={18} />,
    },
  ]

  return (
    <div className=" min-w-75 px-4 py-6 border-r border-border flex flex-col gap-6">
      <div className="px-4">
        <Logo navigateTo={paths.dashboard.root} />
      </div>

      <nav className="flex flex-col gap-1">
        {dashboardRoutes.map(({ path, label, icon }) => (
          <NavItem key={path} path={path} label={label} icon={icon} />
        ))}

        <span className="border-t border-border border-dashed h-1 my-4" />

        <NavItem
          path={paths.home}
          label="Back to Home"
          icon={<Home size={18} />}
        />
      </nav>
    </div>
  )
}

type NavItemProps = { path: string; label: string; icon: React.ReactNode }

function NavItem({ path, label, icon }: NavItemProps) {
  return (
    <NavLink
      key={path}
      to={path}
      end
      className={({ isActive }) =>
        twMerge(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive ? "bg-primary-tint text-primary-on" : "nav-inactive",
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
