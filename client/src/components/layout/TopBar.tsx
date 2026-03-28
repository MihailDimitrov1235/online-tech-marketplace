import { NavLink } from "react-router"
import { twMerge } from "tailwind-merge"

import { paths } from "@/router"
import { Button } from "../common/Button"
import { Logo } from "../common/Logo"
import { Account } from "../common/Account"

import { useAppSelector } from "@/store/hooks"
import { ThemeToggle } from "@/theme/ThemeToggle"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  twMerge(
    "px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200",
    isActive
      ? "bg-primary-tint text-primary-on"
      : "nav-inactive"
  )

export const TopBar = () => {
  const { user } = useAppSelector(state => state.auth)

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
          <NavLink to={paths.dashboard.root} className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <Account />
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
