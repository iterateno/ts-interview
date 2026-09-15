import { describe, expect, it } from 'vitest'
import type { Order } from '../../api/types'
import { formatMoney, lineTotal, orderSubtotal, orderTotal } from '../money'

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'ORD-0001',
    customer: { id: 'c01', name: 'Test Customer', email: 'test@example.com' },
    createdAt: '2026-09-01T10:00:00.000Z',
    status: 'pending',
    currency: 'NOK',
    lines: [
      { sku: 'A', name: 'Item A', quantity: 2, unitPriceCents: 10000 },
      { sku: 'B', name: 'Item B', quantity: 1, unitPriceCents: 5000 },
    ],
    discountPercent: 0,
    shippingCents: 0,
    ...overrides,
  }
}

describe('lineTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(lineTotal({ sku: 'X', name: 'X', quantity: 3, unitPriceCents: 1999 })).toBe(5997)
  })
})

describe('orderSubtotal', () => {
  it('sums all line totals', () => {
    expect(orderSubtotal(makeOrder())).toBe(25000)
  })

  it('is zero for an order without lines', () => {
    expect(orderSubtotal(makeOrder({ lines: [] }))).toBe(0)
  })
})

describe('orderTotal', () => {
  it('equals the subtotal when there is no discount or shipping', () => {
    expect(orderTotal(makeOrder())).toBe(25000)
  })

  it('adds shipping', () => {
    expect(orderTotal(makeOrder({ shippingCents: 7900 }))).toBe(32900)
  })

  it('applies a percentage discount', () => {
    expect(orderTotal(makeOrder({ discountPercent: 10 }))).toBe(22500)
  })
})

describe('formatMoney', () => {
  it('formats cents as a currency string', () => {
    const formatted = formatMoney(123456, 'NOK')
    expect(formatted).toContain('1')
    expect(formatted).toContain('234')
  })
})
