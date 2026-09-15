import type { Order } from '../api/types'
import { formatMoney } from '../domain/money'
import { summarize } from '../domain/orders'
import { ORDER_STATUSES, STATUS_LABELS } from '../domain/status'

interface Props {
  orders: Order[]
}

export function SummaryBar({ orders }: Props) {
  const summary = summarize(orders)
  const currency = orders[0]?.currency ?? 'NOK'

  return (
    <section className="summary">
      <div className="stat">
        <span className="stat-label">Orders</span>
        <span className="stat-value">{summary.count}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Revenue</span>
        <span className="stat-value">{formatMoney(summary.revenueCents, currency)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Avg. order</span>
        <span className="stat-value">{formatMoney(summary.averageOrderCents, currency)}</span>
      </div>
      <div className="stat statuses">
        {ORDER_STATUSES.map((s) => (
          <span key={s} className={`pill pill-${s}`}>
            {STATUS_LABELS[s]} {summary.byStatus[s] ?? 0}
          </span>
        ))}
      </div>
    </section>
  )
}
