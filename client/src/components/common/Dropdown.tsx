import { type ComponentProps, useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TextField } from "./TextField"

type TextFieldProps = ComponentProps<typeof TextField>

type DropdownProps = TextFieldProps & {
  options: { label: string; value: string }[] | string[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder,
  value,
  onChange,
  ...textFieldProps
}) => {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const normalized = options.map(o =>
    typeof o === "string" ? { label: o, value: o } : o,
  )

  const selected = normalized.find(o => o.value === value)

  const filtered = normalized.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  )

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
        value={open ? search : (selected?.label ?? "")}
        onFocus={() => {
          setOpen(true)
        }}
        onChange={e => {
          setSearch(e.target.value)
        }}
        placeholder={placeholder}
        trailingIcon={
          <div
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              setOpen(!open)
            }}
            className="cursor-pointer"
          >
            {open ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </div>
        }
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {filtered.map(opt => (
            <li
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 text-contrast hover:bg-white`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
                setSearch("")
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
