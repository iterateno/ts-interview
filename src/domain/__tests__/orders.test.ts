import { describe, expect, it } from 'vitest'
import { buildSeedOrders } from '../../api/seed'
import { filterOrders, sortOrders, summarize, daysSince } from '../orders'
import { orderTotal } from '../money'

const orders = buildSeedOrders(20)

describe('filterOrders', () => {
  it('returns everything when no params are given', () => {
    expect(filterOrders(orders, {})).toHaveLength(orders.length)
  })

  it('filters by status', () => {
    const result = filterOrders(orders, { status: 'paid' })
    expect(result.every((o) => o.status === 'paid')).toBe(true)
  })

  it('matches on order id', () => {
    const target = orders[3]
    const result = filterOrders(orders, { query: target.id.toLowerCase() })
    expect(result.map((o) => o.id)).toContain(target.id)
  })
})

describe('sortOrders', () => {
  it('sorts by total ascending', () => {
    const result = sortOrders(orders, 'total', 'asc')
    for (let i = 1; i < result.length; i++) {
      expect(orderTotal(result[i])).toBeGreaterThanOrEqual(orderTotal(result[i - 1]))
    }
  })

  it('sorts by createdAt descending', () => {
    const result = sortOrders(orders, 'createdAt', 'desc')
    for (let i = 1; i < result.length; i++) {
      expect(result[i].createdAt <= result[i - 1].createdAt).toBe(true)
    }
  })

  it('does not mutate the input', () => {
    const copy = [...orders]
    sortOrders(orders, 'customer', 'asc')
    expect(orders).toEqual(copy)
  })
})

describe('summarize', () => {
  it('counts orders per status', () => {
    const summary = summarize(orders)
    const total = Object.values(summary.byStatus).reduce((a, b) => a + b, 0)
    expect(total).toBe(orders.length)
  })

  it('computes revenue', () => {
    const summary = summarize(orders)
    expect(summary.revenueCents).toBeGreaterThan(0)
  })

  it('handles an empty list', () => {
    expect(summarize([])).toEqual({ count: 0, revenueCents: 0, byStatus: {}, averageOrderCents: 0 })
  })
})

describe('daysSince', () => {
  it('returns whole days between two dates', () => {
    const now = new Date('2026-09-15T12:00:00.000Z')
    expect(daysSince('2026-09-10T12:00:00.000Z', now)).toBe(5)
  })
})
