import { ORDER_STATUSES, STATUS_LABELS } from '../domain/status'
import type { OrderFilters, SortKey } from '../domain/orders'

interface Props {
  filters: OrderFilters
  onChange: (next: OrderFilters) => void
}

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'createdAt', label: 'Date' },
  { value: 'customer', label: 'Customer' },
  { value: 'total', label: 'Total' },
  { value: 'status', label: 'Status' },
]

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search by order id or customer"
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as OrderFilters['status'] })}
      >
        <option value="all">All statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="ghost"
        onClick={() =>
          onChange({ ...filters, direction: filters.direction === 'asc' ? 'desc' : 'asc' })
        }
        title="Toggle sort direction"
      >
        {filters.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </button>
    </div>
  )
}
