import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 sm:px-10">
          <div className="max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Maso Project
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-700">
              Real-time production management for sheet metal manufacturing. Create orders, assign tasks to machines, track progress, and generate invoices.
            </p>
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#create" className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-5 py-3 text-sm sm:text-base font-semibold shadow hover:bg-slate-800 transition-colors">Create Order</a>
              <a href="#track" className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-5 py-3 text-sm sm:text-base font-semibold shadow border border-slate-200 hover:bg-slate-50 transition-colors">Track Jobs</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white"></div>
    </section>
  )
}

export default Hero
