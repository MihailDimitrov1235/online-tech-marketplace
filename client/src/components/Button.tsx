import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const base =
  "relative inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
 
const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-xs rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-2xl",
};
 
const variants: Record<Variant, string> = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900",
    secondary: "bg-white text-zinc-900 border-1 border-zinc-900 focus-visible:ring-zinc-400",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
    accent: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white hover:brightness-110",
};

export const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};