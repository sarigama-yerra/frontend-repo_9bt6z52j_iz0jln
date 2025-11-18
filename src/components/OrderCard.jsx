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

function Value({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 break-all">{children || '-'}:</span>
    </div>
  )
}

function ItemRow({ item, idx }) {
  return (
    <div className="grid grid-cols-6 gap-2 text-sm text-slate-700">
      <div className="col-span-2 truncate" title={item.name}>{idx + 1}. {item.name || 'Item'}</div>
      <div className="text-right">{item.quantity ?? '-'}</div>
      <div className="text-right">{item.material || '-'}</div>
      <div className="text-right">{item.thickness || '-'}</div>
      <div className="text-right">{item.dimensions || item.size || '-'}</div>
    </div>
  )
}

export default function OrderCard({ order }) {
  const statusColor =
    order?.status === 'completed' ? 'green' :
    order?.status === 'in_progress' ? 'blue' :
    order?.status === 'on_hold' ? 'yellow' :
    order?.status === 'cancelled' ? 'red' : 'slate'

  const priorityColor =
    order?.priority === 'urgent' ? 'red' :
    order?.priority === 'high' ? 'purple' :
    order?.priority === 'low' ? 'slate' : 'blue'

  const createdAt = order?.created_at ? new Date(order.created_at).toLocaleString() : '-'
  const dueDate = order?.due_date ? new Date(order.due_date).toLocaleDateString() : null
  const totalItems = Array.isArray(order?.items) ? order.items.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0) : 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{order?.customer || 'Customer'}</h3>
          <p className="text-xs text-slate-500">Order ID: <span className="font-mono">{order?.id || order?._id || '-'}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={priorityColor}>{order?.priority || 'normal'}</Badge>
          <Badge color={statusColor}>{order?.status || 'new'}</Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Value label="PO Number">{order?.po_number || '—'}</Value>
        <Value label="Created">{createdAt}</Value>
        <Value label="Due">{dueDate || '—'}</Value>
        <Value label="Total Items">{totalItems}</Value>
      </div>

      {Array.isArray(order?.items) && order.items.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Items</h4>
            <span className="text-xs text-slate-500">{order.items.length} line(s)</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="grid grid-cols-6 gap-2 text-[11px] uppercase tracking-wider text-slate-500">
              <div className="col-span-2">Item</div>
              <div className="text-right">Qty</div>
              <div className="text-right">Material</div>
              <div className="text-right">Thk</div>
              <div className="text-right">Size</div>
            </div>
            {order.items.map((it, i) => (
              <ItemRow key={i} item={it} idx={i} />
            ))}
          </div>
        </div>
      )}

      {(order?.subtotal || order?.total) && (
        <div className="mt-4 border-t border-slate-200 pt-3 flex items-center justify-end gap-6 text-sm">
          {order?.subtotal && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-900">${Number(order.subtotal).toFixed(2)}</span>
            </div>
          )}
          {order?.tax && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Tax</span>
              <span className="font-semibold text-slate-900">${Number(order.tax).toFixed(2)}</span>
            </div>
          )}
          {order?.total && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-900">${Number(order.total).toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
