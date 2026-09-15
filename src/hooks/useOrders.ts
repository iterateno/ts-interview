import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Order } from '../api/types'
import { formatMoney, orderTotal } from '../domain/money'
import { daysSince, sortOrders, type OrderFilters } from '../domain/orders'

export interface OrderRowModel {
  id: string
  customerName: string
  createdAt: string
  createdLabel: string
  ageLabel: string
  status: string
  totalLabel: string
  lineCount: number
}

export interface UseOrdersResult {
  orders: Order[]
  rows: OrderRowModel[]
  loading: boolean
  error: string | null
  refresh: () => void
}

function toRowModel(order: Order): OrderRowModel {
  const age = daysSince(order.createdAt)
  return {
    id: order.id,
    customerName: order.customer.name,
    createdAt: order.createdAt,
    createdLabel: new Date(order.createdAt).toLocaleDateString('nb-NO'),
    ageLabel: age === 0 ? 'today' : age === 1 ? '1 day ago' : `${age} days ago`,
    status: order.status,
    totalLabel: formatMoney(orderTotal(order), order.currency),
    lineCount: order.lines.length,
  }
}

export function useOrders(filters: OrderFilters): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)

    api
      .listOrders({ query: filters.query, status: filters.status })
      .then((result) => {
        setOrders(sortOrders(result, filters.sort, filters.direction))
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e.message ?? 'Unknown error')
        setLoading(false)
      })
  }, [filters.query, filters.status, filters.sort, filters.direction, tick])

  return {
    orders,
    rows: orders.map(toRowModel),
    loading,
    error,
    refresh: () => setTick((t) => t + 1),
  }
}
