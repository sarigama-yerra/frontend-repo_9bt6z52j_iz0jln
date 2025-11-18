import Hero from './components/Hero'
import Features from './components/Features'
import QuickCreate from './components/QuickCreate'
import OrdersGrid from './components/OrdersGrid'
import LiveBoard from './components/LiveBoard'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <QuickCreate />
      <OrdersGrid />
      <LiveBoard />
    </div>
  )
}

export default App
