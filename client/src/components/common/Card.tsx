import { twMerge } from "tailwind-merge"

type CardVariant = "default" | "outlined"
type CardSize = "sm" | "md" | "lg"

type CardProps = {
  children: React.ReactNode
  variant?: CardVariant
  size?: CardSize
  className?: string
  onClick?: () => void
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg shadow-zinc-200/50 dark:shadow-black/20",
  outlined: "bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-primary-ring transition-colors duration-300",
}

const sizeStyles: Record<CardSize, string> = {
  sm: "p-4 rounded-md",
  md: "p-6 rounded-lg",
  lg: "px-16 py-8 rounded-xl",
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}) => {
  const baseStyles = "relative flex"
  const interactiveStyles = onClick
    ? "cursor-pointer select-none active:scale-[0.98] transition-transform"
    : ""

  return (
    <div
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        interactiveStyles,
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => (e.key === "Enter" || e.key === " ") && onClick
          : undefined
      }
    >
      {children}
    </div>
  )
}
