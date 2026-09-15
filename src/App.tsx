import { useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { OrderDrawer } from './components/OrderDrawer'
import { OrderTable } from './components/OrderTable'
import { SummaryBar } from './components/SummaryBar'
import { DEFAULT_FILTERS, type OrderFilters } from './domain/orders'
import { useOrders } from './hooks/useOrders'

export default function App() {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { orders, rows, loading, error, refresh } = useOrders(filters)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ledgerly</h1>
        <span className="muted">Orders</span>
      </header>

      <SummaryBar orders={orders} />
      <FilterBar filters={filters} onChange={setFilters} />

      {error && <p className="error">Could not load orders: {error}</p>}

      <OrderTable rows={rows} loading={loading} activeId={activeId} onOpen={setActiveId} />

      <OrderDrawer orderId={activeId} onClose={() => setActiveId(null)} onStatusChanged={refresh} />
    </div>
  )
}
