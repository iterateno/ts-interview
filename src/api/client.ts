import { buildSeedOrders } from './seed'
import type { ListOrdersParams, Order } from './types'
import { filterOrders } from '../domain/orders'

let ORDERS: Order[] = buildSeedOrders()

function latency(): Promise<void> {
  const ms = 80 + Math.random() * 500
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const api = {
  async listOrders(params: ListOrdersParams = {}): Promise<Order[]> {
    await latency()
    return filterOrders(ORDERS, params)
  },

  async getOrder(id: string): Promise<Order> {
    await latency()
    const order = ORDERS.find((o) => o.id === id)
    if (!order) {
      throw new Error(`Order ${id} not found`)
    }
    return order
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    await latency()
    const order = ORDERS.find((o) => o.id === id)
    if (!order) {
      throw new Error(`Order ${id} not found`)
    }
    order.status = status
    return order
  },

  /** Test helper: reset the in-memory store. */
  __reset() {
    ORDERS = buildSeedOrders()
  },
}
