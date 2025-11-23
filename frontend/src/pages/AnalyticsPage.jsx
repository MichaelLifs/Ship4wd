import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevenueChart from '../components/RevenueChart'

function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Default dates: 1.6.24 – 31.12.24 (June 1, 2024 - December 31, 2024)
  const [dateRange, setDateRange] = useState({
    from: '2024-06-01',
    to: '2024-12-31'
  })

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:ml-64 pt-16">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={dateRange} />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <RevenueChart 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange}
          />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default AnalyticsPage

