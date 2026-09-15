import type { OrderRowModel } from '../hooks/useOrders'
import { OrderRow } from './OrderRow'

interface Props {
  rows: OrderRowModel[]
  loading: boolean
  activeId: string | null
  onOpen: (id: string) => void
}

export function OrderTable({ rows, loading, activeId, onOpen }: Props) {
  return (
    <div className={`table-wrap ${loading ? 'is-loading' : ''}`}>
      <table>
        <thead>
          <tr>
            <th />
            <th>Order</th>
            <th>Customer</th>
            <th>Created</th>
            <th>Status</th>
            <th className="num">Lines</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <OrderRow key={index} row={row} active={row.id === activeId} onOpen={onOpen} />
          ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={7} className="empty">
                No orders match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
