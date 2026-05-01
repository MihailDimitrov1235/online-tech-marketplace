import { type ComponentProps } from "react"

type RadioProps = Omit<ComponentProps<"input">, "type" | "onChange"> & {
  label?: string
  onChange?: (value: string) => void
}

export const Radio = ({ label, onChange, ...props }: RadioProps) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          {...props}
          type="radio"
          className="sr-only peer"
          onChange={e => onChange?.(e.target.value)}
        />
        <div className="w-4 h-4 rounded-full border-2 border-border peer-checked:border-primary transition-colors group-hover:border-primary/50" />
        <div className="absolute w-2 h-2 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform" />
      </div>
      {label && (
        <span className="text-sm text-contrast/70 peer-checked:text-contrast group-hover:text-contrast transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}
