import { Check, X, Monitor, Cpu, Database, Battery, Globe, Server, Wifi, Camera, HardDrive, Layers } from "lucide-react"
import type { SpecValue } from "@/types/product"

const SECTION_ICONS: Record<string, React.ReactNode> = {
  display:   <Monitor size={14} />,
  processor: <Cpu size={14} />,
  memory:    <Database size={14} />,
  battery:   <Battery size={14} />,
  os:        <Globe size={14} />,
  network:   <Wifi size={14} />,
  camera:    <Camera size={14} />,
  storage:   <HardDrive size={14} />,
  server:    <Server size={14} />,
  other:     <Layers size={14} />,
}

function SpecValue({ value }: { value: SpecValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium text-sm">
        <Check size={13} strokeWidth={2.5} /> Yes
      </span>
    ) : (
      <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-medium text-sm">
        <X size={13} strokeWidth={2.5} /> No
      </span>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1 justify-end">
        {value.map((v, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary-tint text-primary-on font-medium">
            {String(v)}
          </span>
        ))}
      </div>
    )
  }

  return <span className="text-sm font-semibold text-contrast tabular-nums">{String(value)}</span>
}

function NestedCard({ label, value }: { label: string; value: Record<string, SpecValue> }) {
  const icon = SECTION_ICONS[label.toLowerCase()] ?? SECTION_ICONS.other
  const entries = Object.entries(value)

  return (
    <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-linear-to-r from-primary/5 to-transparent dark:from-primary/10 border-b border-border">
        <span className="w-6 h-6 rounded-lg bg-primary-tint text-primary-on flex items-center justify-center shrink-0">
          {icon}
        </span>
        <p className="text-xs font-semibold text-contrast uppercase tracking-widest">
          {label.replace(/_/g, " ")}
        </p>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-border">
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
            <p className="text-xs text-muted">{key.replace(/_/g, " ")}</p>
            <SpecValue value={val} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ScalarCard({ label, value }: { label: string; value: string | number | boolean }) {
  const icon = SECTION_ICONS[label.toLowerCase()] ?? SECTION_ICONS.other

  return (
    <div className="rounded-2xl bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex items-center gap-4 px-4 py-3.5">
      <span className="w-8 h-8 rounded-xl bg-primary-tint text-primary-on flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex flex-col">
        <p className="text-xs text-muted">{label.replace(/_/g, " ")}</p>
        <div className="mt-0.5">
          <SpecValue value={value} />
        </div>
      </div>
    </div>
  )
}

export function SpecRenderer(Spec: Record<string, SpecValue>) {
  const nested = Object.entries(Spec).filter(([, v]) => typeof v === "object" && v !== null && !Array.isArray(v)) as [string, Record<string, SpecValue>][]
  const scalars = Object.entries(Spec).filter(([, v]) => typeof v !== "object" || v === null || Array.isArray(v)) as [string, string | number | boolean][]

  return (
    <div className="flex flex-col gap-3">
      {scalars.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {scalars.map(([key, value]) => (
            <ScalarCard key={key} label={key} value={value} />
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {nested.map(([key, value]) => (
          <NestedCard key={key} label={key} value={value} />
        ))}
      </div>
    </div>
  )
}
