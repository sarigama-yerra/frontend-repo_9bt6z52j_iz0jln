import { useEffect } from 'react'

function Badge({ children, color = 'slate' }) {
  const colors = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

function Label({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 break-all">{children || '—'}</span>
    </div>
  )
}

export default function OrderModal({ open, onClose, order }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open || !order) return null

  const statusColor =
    order?.status === 'completed' ? 'green' :
    order?.status === 'in_progress' ? 'blue' :
    order?.status === 'on_hold' ? 'yellow' :
    order?.status === 'cancelled' ? 'red' : 'slate'

  const priorityColor =
    order?.priority === 'urgent' ? 'red' :
    order?.priority === 'high' ? 'purple' :
    order?.priority === 'low' ? 'slate' : 'blue'

  const createdAt = order?.created_at ? new Date(order.created_at).toLocaleString() : '—'
  const dueDate = order?.due_date ? new Date(order.due_date).toLocaleDateString() : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[90vh] w-[92vw] sm:w-[720px] overflow-y-auto rounded-xl bg-white shadow-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{order.customer}</h3>
            <p className="text-xs text-slate-500">Order ID: <span className="font-mono">{order.id || order._id}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Badge color={priorityColor}>{order.priority}</Badge>
            <Badge color={statusColor}>{order.status}</Badge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Label label="PO Number">{order.po_number}</Label>
          <Label label="Created">{createdAt}</Label>
          <Label label="Due">{dueDate}</Label>
          <Label label="Notes">{order.notes}</Label>
        </div>

        {Array.isArray(order.items) && order.items.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900">Items</h4>
            <div className="mt-2 divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {order.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 p-3 text-sm text-slate-700">
                  <div className="col-span-2">
                    <div className="font-medium">{it.sku}</div>
                    <div className="text-xs text-slate-500">{it.description}</div>
                  </div>
                  <div className="text-right">Qty: {it.quantity}</div>
                  <div className="text-right">Unit: ${Number(it.unit_price || 0).toFixed(2)}</div>
                  <div className="col-span-2 text-right font-semibold">Line: ${Number((it.quantity || 0) * (it.unit_price || 0)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
