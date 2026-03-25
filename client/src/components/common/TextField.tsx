import { useState, useId } from "react"

type TextFieldVariant = "default" | "underline"
type TextFieldSize = "sm" | "md" | "lg"

type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string
  helperText?: string
  errorText?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  variant?: TextFieldVariant
  size?: TextFieldSize
  fullWidth?: boolean
  className?: string
}

const variantStyles: Record<
  TextFieldVariant,
  { wrapper: string; input: string; focused: string; error: string }
> = {
  default: {
    wrapper:
      "bg-white/50 backdrop-blur-sm border border-zinc-200/80 rounded-xl hover:bg-white/70 hover:border-violet-300 transition-all duration-200 dark:bg-zinc-800/50 dark:border-zinc-700/80 dark:hover:bg-zinc-800/70 dark:hover:border-violet-500",
    input: "bg-transparent",
    focused:
      "ring-0 bg-white/80 border-violet-400 dark:bg-zinc-800/90 dark:border-violet-500",
    error: "border-red-400 hover:border-red-500",
  },
  underline: {
    wrapper:
      "bg-transparent border-0 border-b-2 border-contrast/20 rounded-none hover:border-contrast/50 transition-colors duration-200",
    input: "bg-transparent",
    focused: "ring-0 border-contrast/80",
    error: "border-red-400 hover:border-red-500",
  },
}

const sizeStyles: Record<
  TextFieldSize,
  { wrapper: string; input: string; label: string }
> = {
  sm: {
    wrapper: "px-3 py-1.5",
    input: "text-sm",
    label: "text-xs",
  },
  md: {
    wrapper: "px-4 py-2.5",
    input: "text-sm",
    label: "text-sm",
  },
  lg: {
    wrapper: "px-4 py-3.5",
    input: "text-base",
    label: "text-sm",
  },
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  errorText,
  leadingIcon,
  trailingIcon,
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false)
  const generatedId = useId()
  const id = inputProps.id ?? generatedId

  const hasError = Boolean(errorText)
  const v = variantStyles[variant]
  const s = sizeStyles[size]

  const wrapperClasses = [
    "flex items-center gap-2",
    v.wrapper,
    s.wrapper,
    focused ? v.focused : "",
    hasError ? v.error : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  const inputClasses = [
    "flex-1 outline-none text-contrast placeholder-gray-400",
    s.input,
    v.input,
    disabled ? "cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : "w-fit"}`}>
      {label && (
        <label
          htmlFor={id}
          className={`${s.label} font-medium ${
            hasError ? "text-red-500" : "text-contrast/70"
          }`}
        >
          {label}
        </label>
      )}

      <label htmlFor={id} className={wrapperClasses}>
        {leadingIcon && (
          <span className="text-contrast/50 shrink-0">{leadingIcon}</span>
        )}
        <input
          id={id}
          disabled={disabled}
          className={inputClasses}
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          {...inputProps}
        />
        {trailingIcon && (
          <span className="text-contrast/50 shrink-0">{trailingIcon}</span>
        )}
      </label>

      {(helperText ?? errorText) && (
        <p
          className={`text-xs ${
            hasError ? "text-red-500" : "text-contrast/50"
          }`}
        >
          {errorText ?? helperText}
        </p>
      )}
    </div>
  )
}
