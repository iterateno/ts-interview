import { STATUS_LABELS, isOrderStatus, type OrderStatus } from '../domain/status'

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

interface Props {
  value: string
  disabled?: boolean
  onChange: (next: OrderStatus) => void
}

export function StatusSelect({ value, disabled, onChange }: Props) {
  const current = isOrderStatus(value) ? value : 'draft'
  const options = ALLOWED_TRANSITIONS[current]

  if (options.length === 0) {
    return <span className={`pill pill-${current}`}>{STATUS_LABELS[current]}</span>
  }

  return (
    <select
      className="status-select"
      value={current}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
    >
      <option value={current} disabled>
        {STATUS_LABELS[current]}
      </option>
      {options.map((s) => (
        <option key={s} value={s}>
          → {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  )
}
