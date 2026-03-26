import { useState } from "react"
import { NavLink } from "react-router"
import { twMerge } from "tailwind-merge"
import { User } from "lucide-react"

import { paths } from "@/router"
import { Button } from "../common/Button"
import { Dropdown } from "../common/Menu"
import { Logo } from "../common/Logo"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/authSlice"
import { ThemeToggle } from "@/theme/ThemeToggle"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  twMerge(
    "px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200",
    isActive
      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80"
  )

export const TopBar = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const [open, setOpen] = useState(false)

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ""

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between px-14 h-14">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <Dropdown
              align="bottom-left"
              variant="outline"
              size="icon"
              open={open}
              setOpen={setOpen}
              className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200 text-xs font-bold dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30 dark:hover:bg-violet-500/30"
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
