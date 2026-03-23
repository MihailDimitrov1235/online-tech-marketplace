import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Variant = "primary" | "secondary" | "outline" | "ghost"
type Size = "xs" | "sm" | "md" | "lg" | "icon"

export type ButtonProps = {
  variant?: Variant
  size?: Size
  disabled?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

const base =
  "relative inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none"

const sizes: Record<Size, string> = {
  xs: "px-3 py-1 text-xs rounded-lg",
  sm: "px-4 py-1.5 text-xs rounded-xl",
  md: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-sm rounded-2xl tracking-wide",
  icon: "p-2 text-base rounded-full",
}

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:brightness-110",
  secondary:
    "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 shadow-sm",
  outline:
    "bg-transparent text-contrast border border-zinc-200 hover:bg-zinc-50 shadow-sm",
  ghost:
    "bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
}

export const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className = "",
  onClick,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={twMerge(base, sizes[size], variants[variant], className)}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
