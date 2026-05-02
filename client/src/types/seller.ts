import type { User } from "./auth"

export type Seller = SellerData & { _id: string; user: User; createdAt: Date }

export type Warranty = {
  durationMonths: number
  accidentalDamage: boolean
  wearAndTear: boolean
  resolution: string
  shipping: string
  exclusions: {
    misuse: boolean
    unauthorizedRepairs: boolean
    wearAndTear: boolean
    consumables: boolean
    cosmetic: boolean
  }
}

export type SellerData = {
  address: {
    country: string
    city: string
    street: string
    zip: string
  }
  phone: string
  email: string
  warranty: Warranty
}
