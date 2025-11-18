import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Badge({ children, color = 'slate' }) {
  const colors = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

function LiveBoard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const resp = await fetch(`${apiBase}/api/tasks?limit=50`)
      if (!resp.ok) throw new Error('Failed to load tasks')
      const data = await resp.json()
      setTasks(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section id="track" className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Live production board</h2>
          <button onClick={load} className="text-sm text-slate-700 hover:text-slate-900 underline">Refresh</button>
        </div>
        <p className="text-slate-600 text-sm mt-1">See what each station is working on right now.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && <div className="col-span-full text-sm text-slate-600">Loading...</div>}
          {error && <div className="col-span-full text-sm text-red-600">{error}</div>}
          {!loading && !error && tasks.length === 0 && (
            <div className="col-span-full text-sm text-slate-600">No tasks yet.</div>
          )}

          {tasks.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{t.name}</h3>
                <Badge color={t.status === 'done' ? 'green' : t.status === 'in_progress' ? 'blue' : 'slate'}>
                  {t.status}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                <p>Order: <span className="font-medium">{t.order_id}</span></p>
                {t.machine_id && <p>Machine: <span className="font-medium">{t.machine_id}</span></p>}
                {t.group && <p>Group: <span className="font-medium">{t.group}</span></p>}
                {t.assignee && <p>Assignee: <span className="font-medium">{t.assignee}</span></p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LiveBoard
