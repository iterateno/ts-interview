export interface Customer {
  id: string
  name: string
  email: string
}

export interface OrderLine {
  sku: string
  name: string
  quantity: number
  unitPriceCents: number
}

export interface Order {
  id: string
  customer: Customer
  createdAt: string
  status: string
  currency: string
  lines: OrderLine[]
  discountPercent: number
  shippingCents: number
  notes?: string
}

export interface ListOrdersParams {
  query?: string
  status?: string
}
