import type { detailedProduct } from "./product"

export type genericPart = Omit<detailedProduct, "type">
export type ProcessorProduct = genericPart & { type: "processor" }
export type MotherboardProduct = genericPart & { type: "motherboard" }
export type GpuProduct = genericPart & { type: "gpu" }
export type RamProduct = genericPart & { type: "ram" }
export type StorageProduct = genericPart & { type: "storage" }
export type PsuProduct = genericPart & { type: "psu" }
export type CaseProduct = genericPart & { type: "case" }

export type Parts = {
  processor: ProcessorProduct
  motherboard: MotherboardProduct
  gpu?: GpuProduct
  ram: [RamProduct, ...RamProduct[]]
  storage: [StorageProduct, ...StorageProduct[]]
  psu: PsuProduct
  case?: CaseProduct
}

export type ConfigurationPartsInput = {
  processor: string
  motherboard: string
  gpu?: string
  ram: string[]
  storage: string[]
  psu: string
  case?: string
}

export type Configuration = {
  _id: string
  name: string
  description: string
  author: { _id: string; username: string }
  clonedFrom?: { _id: string; name: string } | null
  parts: Parts
  totalPrice: number
  createdAt: string
}
