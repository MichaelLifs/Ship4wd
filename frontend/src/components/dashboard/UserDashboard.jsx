import { useState, useEffect } from 'react'
import { incomeTransactionService } from '../../services/incomeTransactionService'
import { shopService } from '../../services/shopService'
import { authService } from '../../services/authService'

function UserDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExpenses: 0,
    weeklyExpenses: 0,
    monthlyExpenses: 0,
  })
  const [shopExpenses, setShopExpenses] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        setLoading(false)
        return
      }

      // Get all income transactions (payments made by users)
      const allTransactions = await incomeTransactionService.getAllIncomeTransactions()
      
      // Filter transactions by current user (by customer_name) - exact match
      // Only show transactions where customer_name matches the current user's full name
      const userFullName = `${currentUser.name} ${currentUser.last_name}`.trim()
      
      // Filter to show ONLY transactions of the current user
      const userTransactions = allTransactions.filter(
        transaction => {
          // Exact match to ensure user only sees their own transactions
          const transactionCustomerName = (transaction.customer_name || '').trim()
          return transactionCustomerName === userFullName
        }
      )

      // Only process if user has transactions
      if (userTransactions.length === 0) {
        setStats({
          totalExpenses: 0,
          weeklyExpenses: 0,
          monthlyExpenses: 0,
        })
        setShopExpenses([])
        setLoading(false)
        return
      }

      // Get all shops to map shop_id to shop_name
      const allShops = await shopService.getAllShops()
      const shopMap = new Map(allShops.map(shop => [shop.id, shop.shop_name]))

      // Calculate dates
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Calculate stats
      let totalExpenses = 0
      let weeklyExpenses = 0
      let monthlyExpenses = 0

      const shopExpenseMap = new Map()

      userTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.transaction_date)
        const amount = parseFloat(transaction.amount) || 0

        totalExpenses += amount

        if (transactionDate >= oneWeekAgo) {
          weeklyExpenses += amount
        }

        if (transactionDate >= oneMonthAgo) {
          monthlyExpenses += amount
        }

        // Group by shop
        const shopName = shopMap.get(transaction.shop_id) || `Shop #${transaction.shop_id}`
        if (!shopExpenseMap.has(shopName)) {
          shopExpenseMap.set(shopName, { shopName, total: 0, count: 0 })
        }
        const shopData = shopExpenseMap.get(shopName)
        shopData.total += amount
        shopData.count += 1
      })

      // Calculate average per shop
      const shopExpensesArray = Array.from(shopExpenseMap.values()).map(shop => ({
        shopName: shop.shopName,
        amount: shop.total,
        visits: shop.count,
        average: shop.count > 0 ? shop.total / shop.count : 0
      })).sort((a, b) => b.amount - a.amount)

      setStats({
        totalExpenses,
        weeklyExpenses,
        monthlyExpenses,
      })
      setShopExpenses(shopExpensesArray)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Expenses Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Last Week</p>
              <p className="text-3xl font-bold text-gray-900">${stats.weeklyExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">7 days</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Last Month</p>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">30 days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Shop */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Shop</h3>
        {shopExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses found
          </div>
        ) : (
          <div className="space-y-4">
            {shopExpenses.map((shop, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{shop.shopName}</p>
                  <p className="text-sm text-gray-500">{shop.visits} {shop.visits === 1 ? 'visit' : 'visits'} • Avg: ${shop.average.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${shop.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Total spent</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
