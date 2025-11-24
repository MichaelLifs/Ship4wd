import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevenueChart from '../components/RevenueChart'

function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [dateRange, setDateRange] = useState({
    from: '2024-06-01',
    to: '2024-12-31'
  })

  const handleDateRangeChange = (newRange: { from: string; to: string }) => {
    setDateRange(newRange)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={dateRange} />

        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">View revenue analysis for all shops</p>
          </div>
          
          <RevenueChart 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange}
            shopId={undefined}
            shopName={null}
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default AnalyticsPage
