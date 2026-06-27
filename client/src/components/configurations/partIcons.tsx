import type { LucideIcon } from "lucide-react"
import { Cpu, Server, Monitor, Database, HardDrive, Battery, Layers } from "lucide-react"

export type PartType =
  | "processor"
  | "motherboard"
  | "gpu"
  | "ram"
  | "storage"
  | "psu"
  | "case"

export const PART_LABELS: Record<PartType, string> = {
  processor: "Processor",
  motherboard: "Motherboard",
  gpu: "Graphics card",
  ram: "RAM",
  storage: "Storage",
  psu: "Power supply",
  case: "Case",
}

export const PART_ICON_COMPONENTS: Record<PartType, LucideIcon> = {
  processor: Cpu,
  motherboard: Server,
  gpu: Monitor,
  ram: Database,
  storage: HardDrive,
  psu: Battery,
  case: Layers,
}
