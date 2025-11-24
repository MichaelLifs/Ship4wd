import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RevenueChart from '../components/RevenueChart'
import { shopService } from '../services/shopService'
import { toast } from 'react-toastify'

function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const shopId = searchParams.get('shopId')
  const [shopName, setShopName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [dateRange, setDateRange] = useState({
    from: '2024-06-01',
    to: '2024-12-31'
  })

  useEffect(() => {
    if (shopId) {
      fetchShopDetails(parseInt(shopId))
    } else {
      setShopName(null)
    }
  }, [shopId])

  const fetchShopDetails = async (id: number) => {
    try {
      setLoading(true)
      const shop = await shopService.getShopById(id)
      setShopName(shop.shop_name)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load shop details'
      toast.error(errorMessage)
      setShopName(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (newRange: { from: string; to: string }) => {
    setDateRange(newRange)
  }

  const handleBackToShops = () => {
    navigate('/my-shops')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={dateRange} />

        <main className="p-4 lg:p-6">
          {shopId && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <button
                  onClick={handleBackToShops}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back to My Shops</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : shopName ? `${shopName} - Expenses` : 'Shop Expenses'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">View and manage expenses for this shop</p>
              </div>
            </div>
          )}
          <RevenueChart 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange}
            shopId={shopId ? parseInt(shopId) : undefined}
            shopName={shopName}
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default AnalyticsPage

