import { useState } from 'react'
import type { OrderRowModel } from '../hooks/useOrders'
import { STATUS_LABELS, isOrderStatus } from '../domain/status'

interface Props {
  row: OrderRowModel
  active: boolean
  onOpen: (id: string) => void
}

export function OrderRow({ row, active, onOpen }: Props) {
  const [selected, setSelected] = useState(false)
  const statusLabel = isOrderStatus(row.status) ? STATUS_LABELS[row.status] : row.status

  return (
    <tr className={active ? 'active' : undefined} onClick={() => onOpen(row.id)}>
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
          aria-label={`Select ${row.id}`}
        />
      </td>
      <td className="mono">{row.id}</td>
      <td>{row.customerName}</td>
      <td title={row.createdAt}>
        {row.createdLabel} <span className="muted">({row.ageLabel})</span>
      </td>
      <td>
        <span className={`pill pill-${row.status}`}>{statusLabel}</span>
      </td>
      <td className="num">{row.lineCount}</td>
      <td className="num">{row.totalLabel}</td>
    </tr>
  )
}
