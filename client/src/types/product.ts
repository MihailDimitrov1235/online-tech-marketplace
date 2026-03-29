import type { User } from "./auth"

export type SpecValue =
  | string
  | number
  | boolean
  | SpecValue[]
  | { [key: string]: SpecValue }

export type detailedProduct = {
  _id: string
  images: string[]
  imageKeys: string[]
  name: string
  type: string
  condition: string
  price: number
  stock: number
  seller: User
  specs: Record<string, SpecValue>
  createdAt: string
  updatedAt: string
}
