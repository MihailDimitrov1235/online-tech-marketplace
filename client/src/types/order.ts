import type { User } from "./auth"
import type { Warranty } from "./seller"

export type status =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"

export type orderItem = {
  product: {
    _id: string
    name: string
    images: string[]
    price: number
    seller: User
  }
  quantity: number
  status: status
  warranty?: Warranty
}

export type order = {
  _id: string
  buyer: User
  items: orderItem[]
  status: status
  total: number
  shippingAddress: {
    street: string
    city: string
    country: string
    zip: number
  }
  delivery: User
  createdAt: string
}
