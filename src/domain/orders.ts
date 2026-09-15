import type { ListOrdersParams, Order } from '../api/types'
import { orderTotal } from './money'
import type { OrderStatus } from './status'

export type SortKey = 'createdAt' | 'customer' | 'total' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface OrderFilters {
  query: string
  status: OrderStatus | 'all'
  sort: SortKey
  direction: SortDirection
}

export const DEFAULT_FILTERS: OrderFilters = {
  query: '',
  status: 'all',
  sort: 'createdAt',
  direction: 'desc',
}

export function filterOrders(orders: Order[], params: ListOrdersParams): Order[] {
  const query = (params.query ?? '').trim()
  const status = params.status ?? 'all'

  return orders.filter((order) => {
    if (status !== 'all' && order.status !== status) {
      return false
    }
    if (query.length > 0) {
      const haystack = `${order.id} ${order.customer.name}`.toLowerCase()
      if (!haystack.includes(query)) {
        return false
      }
    }
    return true
  })
}

export function sortOrders(orders: Order[], sort: SortKey, direction: SortDirection): Order[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...orders].sort((a, b) => {
    switch (sort) {
      case 'createdAt':
        return sign * a.createdAt.localeCompare(b.createdAt)
      case 'customer':
        return sign * a.customer.name.localeCompare(b.customer.name, 'nb')
      case 'total':
        return sign * (orderTotal(a) - orderTotal(b))
      case 'status':
        return sign * a.status.localeCompare(b.status)
    }
  })
}

export interface OrderSummary {
  count: number
  revenueCents: number
  byStatus: Record<string, number>
  averageOrderCents: number
}

export function summarize(orders: Order[]): OrderSummary {
  const byStatus: Record<string, number> = {}
  let revenueCents = 0

  for (const order of orders) {
    byStatus[order.status] = (byStatus[order.status] ?? 0) + 1
    revenueCents += orderTotal(order)
  }

  return {
    count: orders.length,
    revenueCents,
    byStatus,
    averageOrderCents: orders.length === 0 ? 0 : Math.round(revenueCents / orders.length),
  }
}

export function daysSince(iso: string, now: Date = new Date()): number {
  const then = new Date(iso).getTime()
  return Math.floor((now.getTime() - then) / 86_400_000)
}
