import { NavLink } from "react-router"
import { twMerge } from "tailwind-merge"

import { paths } from "@/router"
import { Button } from "../common/Button"
import { Dropdown } from "../common/Dropdown"
import { Logo } from "../common/Logo"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/authSlice"
import { useState } from "react"
import { User } from "lucide-react"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  twMerge(
    "px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200",
    isActive
      ? "bg-violet-50 text-violet-700"
      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
  )

export const TopBar = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const [open, setOpen] = useState(false)

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ""

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 h-14">
        <Logo />

        <nav className="flex items-center gap-1">
          <NavLink to={paths.home} className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to={paths.listings} className={navLinkClass}>
            Listings
          </NavLink>
          <NavLink to={paths.dashboard} className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>

        <div>
          {user ? (
            <Dropdown
              align="bottom-left"
              variant="outline"
              size="icon"
              open={open}
              setOpen={setOpen}
              className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200 text-xs font-bold"
              menuItems={[
                { label: "Settings", link: paths.settings },
                { label: "Logout", onClick: () => dispatch(logout()) },
              ]}
            >
              {initials || <User size={14} />}
            </Dropdown>
          ) : (
            <NavLink to={paths.auth.login}>
              <Button size="sm" variant="primary">Login</Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
