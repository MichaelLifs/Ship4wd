import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { shopService } from '../services/shopService'
import { expenseService } from '../services/expenseService'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

interface Shop {
  id: number;
  shop_name: string;
  user_id: number[] | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

const ExpenseDialog = ({ isOpen, onClose, shop }: { isOpen: boolean; onClose: () => void; shop: Shop | null }) => {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0]
      setDate(today)
      setAmount('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      setError('Please select a date')
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!shop) {
      setError('Shop information is missing')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      
      await expenseService.createExpense({
        shop_id: shop.id,
        amount: parseFloat(amount),
        expense_date: date
      })
      
      toast.success(`Expense created successfully! Date: ${date}, Amount: $${parseFloat(amount).toFixed(2)}`)
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expense'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !shop) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Expense</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Shop:</p>
              <p className="text-lg font-semibold text-gray-900">{shop.shop_name}</p>
              {shop.description && (
                <p className="text-sm text-gray-500 mt-1">{shop.description}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

function ShopManagerShopsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  useEffect(() => {
    fetchManagedShops()
  }, [])

  const fetchManagedShops = async () => {
    try {
      setLoading(true)
      setError(null)
      const currentUser = authService.getCurrentUser()
      if (!currentUser || !currentUser.id) {
        throw new Error('User not found')
      }
      
      const managedShops = await shopService.getShopsByManagerId(currentUser.id)
      setShops(managedShops)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shops'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop)
    setIsExpenseDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={undefined} />

        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Shops</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage expenses for shops you manage ({shops.length} shop{shops.length !== 1 ? 's' : ''})
            </p>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading shops...</div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchManagedShops}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : shops.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No shops found</p>
                  <p className="text-gray-400 text-sm">You are not managing any shops yet.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => handleShopClick(shop)}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-green-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{shop.shop_name}</h3>
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {shop.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {shop.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                    {shop.address && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{shop.address}</span>
                      </div>
                    )}
                    {shop.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{shop.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Add Expense
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>

      <ExpenseDialog
        isOpen={isExpenseDialogOpen}
        onClose={() => {
          setIsExpenseDialogOpen(false)
          setSelectedShop(null)
        }}
        shop={selectedShop}
      />
    </div>
  )
}

export default ShopManagerShopsPage

