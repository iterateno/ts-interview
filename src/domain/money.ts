import type { Order, OrderLine } from '../api/types'

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export function lineTotal(line: OrderLine): number {
  return line.quantity * line.unitPriceCents
}

export function orderSubtotal(order: Order): number {
  return order.lines.reduce((sum, line) => sum + lineTotal(line), 0)
}

export function discountAmount(order: Order): number {
  const gross = orderSubtotal(order) + order.shippingCents
  return Math.round(gross * (order.discountPercent / 100))
}

export function orderTotal(order: Order): number {
  return orderSubtotal(order) + order.shippingCents - discountAmount(order)
}
