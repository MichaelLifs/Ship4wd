function ShopDashboard() {
  // Mock data - will be replaced with API calls later
  const stats = {
    totalIncome: 101333,
    totalExpense: 26830,
    clearRevenue: 74503,
    monthlyIncome: 14503,
    monthlyExpense: 6800
  }

  const incomeBreakdown = [
    { label: 'Sales', amount: 38350, percentage: 38.5 },
    { label: 'Services', amount: 28300, percentage: 28.3 },
    { label: 'Other', amount: 34683, percentage: 34.4 }
  ]

  return (
    <div className="space-y-6">
      {/* Top Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Balance Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">My Balance</h3>
            <select className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1">
              <option>All time</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mb-2">Total balance</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">₪{stats.clearRevenue.toLocaleString()}</p>
          <div className="space-y-1">
            <p className="text-xs text-green-600">Total earned last time +₪{stats.monthlyIncome.toLocaleString()}</p>
            <p className="text-xs text-green-600">Total bonus +₪700.00</p>
          </div>
        </div>

        {/* My Income Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">My Income</h3>
            <span className="text-xs text-gray-500">July 2024</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">Total income</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">₪{stats.totalIncome.toLocaleString()}</p>
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-600">Min -2.4% APR</p>
            <p className="text-xs text-green-600">Earned +₪458.00</p>
          </div>
          <div className="space-y-2">
            {incomeBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{item.label}</span>
                <span className="text-xs font-medium text-gray-900">₪{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Total Expense</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">₪{stats.totalExpense.toLocaleString()}</p>
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-600">Min 7.4% APR</p>
            <p className="text-xs text-green-600">Earned +₪800.00</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">July 2024</span>
              <span className="text-xs text-gray-600">With a goal of 75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Money Flow */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700">Money Flow</h3>
          <select className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
            const incomeHeight = Math.random() * 60 + 30
            const expenseHeight = Math.random() * 40 + 20
            return (
              <div key={month} className="flex-1 flex flex-col items-center group relative">
                <div className="w-full flex flex-col-reverse items-center gap-1">
                  <div 
                    className="w-full bg-green-400 rounded-t hover:bg-green-500 transition-colors cursor-pointer"
                    style={{ height: `${expenseHeight}%` }}
                    title={`Expense: ₪${Math.floor(Math.random() * 5000 + 2000)}`}
                  ></div>
                  <div 
                    className="w-full bg-green-600 rounded-t hover:bg-green-700 transition-colors cursor-pointer"
                    style={{ height: `${incomeHeight}%` }}
                    title={`Income: ₪${Math.floor(Math.random() * 8000 + 5000)}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{month}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-xs text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-xs text-gray-600">Expense</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopDashboard

