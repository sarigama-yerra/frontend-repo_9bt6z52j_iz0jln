import { useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function QuickCreate() {
  const [customer, setCustomer] = useState('')
  const [priority, setPriority] = useState('normal')
  const [po, setPo] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCreatedId(null)

    try {
      const resp = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, po_number: po, items: [], priority })
      })
      if (!resp.ok) throw new Error('Failed to create order')
      const data = await resp.json()
      setCreatedId(data.id)
      setCustomer('')
      setPo('')
      setPriority('normal')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create" className="py-12 sm:py-16 bg-slate-50">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Quick create an order</h2>
          <p className="text-slate-600 text-sm mt-1">Minimal fields now — you can add items and files later.</p>

          <form onSubmit={createOrder} className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              className="col-span-1 sm:col-span-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="PO Number (optional)"
              value={po}
              onChange={(e) => setPo(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              type="submit"
              className="sm:col-span-4 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
            {createdId && (
              <div className="sm:col-span-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                Order created. ID: {createdId}
              </div>
            )}
            {error && (
              <div className="sm:col-span-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default QuickCreate
