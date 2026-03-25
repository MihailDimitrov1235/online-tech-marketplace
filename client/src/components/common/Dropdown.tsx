import { useEffect, useRef, useState } from "react"
import {
  TextField,
  type TextFieldSize,
  type TextFieldVariant,
} from "./TextField"
import { ChevronDown, ChevronUp } from "lucide-react"

type DropdownProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> & {
  options: { label: string; value: string }[] | string[]
  value?: string
  onChange: (value: string) => void
  label?: string
  helperText?: string
  errorText?: string
  variant?: TextFieldVariant
  size?: TextFieldSize
  fullWidth?: boolean
  className?: string
  placeholder?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  ...textFieldProps
}) => {
  const normalized = options.map(o =>
    typeof o === "string" ? { label: o, value: o } : o,
  )
  const filtered = normalized.filter(o =>
    o.label.toLowerCase().includes(value?.toLowerCase() ?? ""),
  )
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`relative ${textFieldProps.fullWidth ? "w-full" : "w-fit"}`}
    >
      <TextField
        {...textFieldProps}
        value={value}
        onFocus={() => {
          setOpen(true)
        }}
        onChange={data => {
          onChange(data.target.value)
        }}
        placeholder={placeholder}
        trailingIcon={open ? <ChevronDown /> : <ChevronUp />}
        className="cursor-pointer"
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {filtered.map(opt => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 text-contrast hover:bg-white`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
