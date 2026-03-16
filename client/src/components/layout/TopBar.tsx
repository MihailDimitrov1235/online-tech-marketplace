import { NavLink } from "react-router"

import { paths } from "@/router";

import { Button } from "../Button"
import { Logo } from "../Logo";

export const TopBar = () => {
  return (
    <div className="flex w-full items-center justify-between px-6 py-3 border-b border-neutral/40 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <Logo />

      <nav className="flex items-center gap-1">
        <Button variant="ghost" size="sm">Listings</Button>
        <Button variant="ghost" size="sm">About us</Button>
      </nav>

      <NavLink to={paths.auth.login}>
        <Button size="sm">Login</Button>
      </NavLink>
    </div>
  )
}