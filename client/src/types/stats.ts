export type SellerStats = {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalProducts: number
}

export type DeliveryStats = {
  assigned: number
  inProgress: number
  delivered: number
}

export type AdminStats = {
  totalUsers: number
  pendingVerifications: number
  totalOrders: number
  totalProducts: number
}

export type BuyerStats = {
  totalOrders: number
  pendingOrders: number
  totalSpent: number
}

export type Stats = {
  buyer?: BuyerStats
  seller?: SellerStats
  delivery?: DeliveryStats
  admin?: AdminStats
}
