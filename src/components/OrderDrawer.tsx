import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Order } from '../api/types'
import { discountAmount, formatMoney, lineTotal, orderSubtotal, orderTotal } from '../domain/money'
import type { OrderStatus } from '../domain/status'
import { StatusSelect } from './StatusSelect'

interface Props {
  orderId: string | null
  onClose: () => void
  onStatusChanged: () => void
}

export function OrderDrawer({ orderId, onClose, onStatusChanged }: Props) {
  const [order, setOrder] = useState<Order | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setOrder(null)
      return
    }
    let cancelled = false
    api.getOrder(orderId).then((o) => {
      if (!cancelled) setOrder(o)
    })
    return () => {
      cancelled = true
    }
  }, [orderId])

  if (!orderId) return null

  async function changeStatus(next: OrderStatus) {
    if (!order) return
    setSaving(true)
    try {
      const updated = await api.updateOrderStatus(order.id, next)
      setOrder(updated)
      onStatusChanged()
    } finally {
      setSaving(false)
    }
  }

  return (
    <aside className="drawer">
      <header>
        <h2>{orderId}</h2>
        <button type="button" className="ghost" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>

      {!order ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <dl className="meta">
            <dt>Customer</dt>
            <dd>
              {order.customer.name}
              <br />
              <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
            </dd>
            <dt>Created</dt>
            <dd>{new Date(order.createdAt).toLocaleString('nb-NO')}</dd>
            <dt>Status</dt>
            <dd>
              <StatusSelect value={order.status} disabled={saving} onChange={changeStatus} />
            </dd>
            {order.notes && (
              <>
                <dt>Notes</dt>
                <dd>{order.notes}</dd>
              </>
            )}
          </dl>

          <table className="lines">
            <thead>
              <tr>
                <th>Item</th>
                <th className="num">Qty</th>
                <th className="num">Unit</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line) => (
                <tr key={line.sku}>
                  <td>
                    {line.name} <span className="muted mono">{line.sku}</span>
                  </td>
                  <td className="num">{line.quantity}</td>
                  <td className="num">{formatMoney(line.unitPriceCents, order.currency)}</td>
                  <td className="num">{formatMoney(lineTotal(line), order.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Subtotal</td>
                <td className="num">{formatMoney(orderSubtotal(order), order.currency)}</td>
              </tr>
              {order.discountPercent > 0 && (
                <tr>
                  <td colSpan={3}>Discount ({order.discountPercent}%)</td>
                  <td className="num">−{formatMoney(discountAmount(order), order.currency)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={3}>Shipping</td>
                <td className="num">{formatMoney(order.shippingCents, order.currency)}</td>
              </tr>
              <tr className="grand">
                <td colSpan={3}>Total</td>
                <td className="num">{formatMoney(orderTotal(order), order.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </aside>
  )
}
