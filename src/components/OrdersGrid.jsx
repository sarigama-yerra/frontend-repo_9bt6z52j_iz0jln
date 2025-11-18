import { useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import OrderModal from './OrderModal'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function OrdersGrid() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await fetch(`${apiBase}/api/orders?limit=50`)
      if (!resp.ok) throw new Error('Failed to load orders')
      const data = await resp.json()
      setOrders(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent orders</h2>
          <button onClick={load} className="text-sm text-slate-700 hover:text-slate-900 underline">Refresh</button>
        </div>
        <p className="text-slate-600 text-sm mt-1">A quick overview of orders with customer, status, items, and totals.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && <div className="col-span-full text-sm text-slate-600">Loading...</div>}
          {error && <div className="col-span-full text-sm text-red-600">{error}</div>}
          {!loading && !error && orders.length === 0 && (
            <div className="col-span-full text-sm text-slate-600">No orders yet. Create one above.</div>
          )}
          {orders.map((o) => (
            <button key={o.id || o._id} onClick={() => setSelected(o)} className="text-left">
              <OrderCard order={o} />
            </button>
          ))}
        </div>
      </div>

      <OrderModal open={!!selected} order={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
