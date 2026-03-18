import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const base =
  "relative inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
 
const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-xs rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-2xl",
  icon: "p-1.5 text-base rounded-full"
};
 
const variants: Record<Variant, string> = {
    primary: "bg-gradient-to-br text-primary-contrast from-primary to-primary/50 hover:brightness-105",
    secondary: "bg-neutral text-contrast hover:bg-neutral/80",
    outline: "bg-white border-1 border-neutral",
    ghost: "bg-transparent text-black hover:bg-neutral/10",
};

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
  );
};