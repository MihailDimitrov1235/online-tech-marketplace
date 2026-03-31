import type { User } from "./auth"

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
  }
  quantity: number
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
  createdAt: string
}
