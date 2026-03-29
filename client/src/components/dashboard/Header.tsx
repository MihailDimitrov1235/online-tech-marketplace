import { ThemeToggle } from "@/theme/ThemeToggle"
import { Account, Button } from "../common"
import { paths } from "@/router"
import { NavLink } from "react-router"
import { ShoppingCart } from "lucide-react"

export default function Header() {
  return (
    <div className="h-16 flex justify-end items-center px-8 border-b border-border">
      <div className="flex items-center gap-3">
        <NavLink to={paths.cart}>
          <Button size="icon" variant="outline">
            <ShoppingCart size={16} />
          </Button>
        </NavLink>
        <ThemeToggle />

        <Account />
      </div>
    </div>
  )
}
