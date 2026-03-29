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
  default: "bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-md",
  outlined:
    "bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-neutral hover:border-gray-400 transition-colors duration-300",
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
