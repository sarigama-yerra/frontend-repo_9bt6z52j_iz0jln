import { useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ItemEditor({ item, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <input
        className="col-span-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        placeholder="SKU"
        value={item.sku}
        onChange={(e) => onChange({ ...item, sku: e.target.value })}
        required
      />
      <input
        className="col-span-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
      />
      <input
        type="number"
        min={1}
        className="col-span-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        placeholder="Qty"
        value={item.quantity}
        onChange={(e) => onChange({ ...item, quantity: Number(e.target.value) || 1 })}
        required
      />
      <input
        type="number"
        step="0.01"
        min={0}
        className="col-span-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        placeholder="Unit Price"
        value={item.unit_price}
        onChange={(e) => onChange({ ...item, unit_price: Number(e.target.value) || 0 })}
      />
      <button
        type="button"
        onClick={onRemove}
        className="col-span-1 inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Remove
      </button>
    </div>
  )
}

function QuickCreate() {
  const [customer, setCustomer] = useState('')
  const [priority, setPriority] = useState('normal')
  const [po, setPo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [items, setItems] = useState([{ sku: '', description: '', quantity: 1, unit_price: 0 }])

  const [createdId, setCreatedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addItem = () => setItems((arr) => [...arr, { sku: '', description: '', quantity: 1, unit_price: 0 }])
  const updateItem = (idx, next) => setItems((arr) => arr.map((it, i) => (i === idx ? next : it)))
  const removeItem = (idx) => setItems((arr) => arr.filter((_, i) => i !== idx))

  const createOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setCreatedId(null)

    try {
      const payload = {
        customer,
        po_number: po || undefined,
        priority,
        notes: notes || undefined,
        items: items.filter((it) => it.sku && it.quantity > 0),
      }
      if (dueDate) {
        // convert date (yyyy-mm-dd) to ISO beginning of day UTC
        payload.due_date = new Date(`${dueDate}T00:00:00Z`).toISOString()
      }

      const resp = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Failed to create order')
      const data = await resp.json()
      setCreatedId(data.id)
      setCustomer('')
      setPo('')
      setPriority('normal')
      setDueDate('')
      setNotes('')
      setItems([{ sku: '', description: '', quantity: 1, unit_price: 0 }])
      setExpanded(false)
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create an order</h2>
          <p className="text-slate-600 text-sm mt-1">Add full details now so production can start right away.</p>

          <form onSubmit={createOrder} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div className="sm:col-span-3" />
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              {expanded ? 'Hide additional details' : 'Add more details (notes & items)'}
            </button>

            {expanded && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Notes</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    rows={3}
                    placeholder="Special instructions, materials, delivery notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-900">Items</label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-sm text-slate-700 hover:text-slate-900 underline"
                    >
                      Add item
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {items.map((it, idx) => (
                      <ItemEditor
                        key={idx}
                        item={it}
                        onChange={(next) => updateItem(idx, next)}
                        onRemove={() => removeItem(idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>

            {createdId && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                Order created. ID: {createdId}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
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
