import { ThemeToggle } from "@/theme/ThemeToggle";
import { Account } from "../common";

export default function Header() {
  return (
    <div className="h-16 flex justify-end items-center px-8 border-b border-border">

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Account />
      </div>
    </div>
  )
}