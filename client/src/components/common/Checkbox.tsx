// components/common/Checkbox.tsx
import { Check } from "lucide-react"
import { type ComponentProps } from "react"

type CheckboxProps = Omit<ComponentProps<"input">, "type" | "onChange"> & {
  label?: string
  onChange?: (checked: boolean) => void
}

export const Checkbox = ({ label, onChange, ...props }: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          {...props}
          type="checkbox"
          className="sr-only peer"
          onChange={e => onChange?.(e.target.checked)}
        />
        <div className="w-4 h-4 rounded border-2 border-border peer-checked:border-primary peer-checked:bg-primary transition-colors group-hover:border-primary/50" />
        <Check
          size={10}
          className="absolute text-primary-contrast opacity-0 peer-checked:opacity-100 transition-opacity"
          strokeWidth={3}
        />
      </div>
      {label && (
        <span className="text-sm text-contrast/70 group-hover:text-contrast transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}
