function Feature({ title, desc }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-slate-600 text-sm">{desc}</p>
    </div>
  )
}

function Features() {
  const items = [
    {
      title: 'Order Creation',
      desc: 'Set customer, items, due dates, priority and notes. Attach PDF, DXF or images.'
    },
    {
      title: 'Task Assignment',
      desc: 'Dispatch jobs to specific machines or groups. Employees see their queue instantly.'
    },
    {
      title: 'Live Tracking',
      desc: 'Operators update status as they work so managers can see progress in real-time.'
    },
    {
      title: 'Invoicing',
      desc: 'Generate invoice drafts from completed orders with tax and totals calculated.'
    }
  ]

  return (
    <section id="features" className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything you need to run production</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <Feature key={i.title} title={i.title} desc={i.desc} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
