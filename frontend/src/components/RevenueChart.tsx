import { useState, useEffect, useCallback } from 'react'
import { Chart } from 'react-google-charts'
import { incomeTransactionService } from '../services/incomeTransactionService'
import { expenseService } from '../services/expenseService'
import { toast } from 'react-toastify'

interface RevenueChartProps {
  dateRange: {
    from: string
    to: string
  }
  onDateRangeChange: (range: { from: string; to: string }) => void
  shopId?: number
  shopName?: string | null
}

type ChartData = (string | number)[][]

interface DailyData {
  income: number
  outcome: number
  clearRevenue: number
}

function RevenueChart({ dateRange, onDateRangeChange, shopId, shopName }: RevenueChartProps) {
  const [fromDate, setFromDate] = useState(dateRange.from)
  const [toDate, setToDate] = useState(dateRange.to)
  const [chartData, setChartData] = useState<ChartData>([['Date', 'Income', 'Outcome', 'Clear Revenue']])
  const [loading, setLoading] = useState(false)

  const fetchAndProcessData = useCallback(async () => {
    try {
      setLoading(true)
      
      const [incomeTransactions, expenses] = await Promise.all([
        shopId 
          ? incomeTransactionService.getIncomeTransactionsByShopId(shopId)
          : incomeTransactionService.getAllIncomeTransactions(),
        shopId
          ? expenseService.getExpensesByShopId(shopId)
          : expenseService.getAllExpenses()
      ])

      const startDate = new Date(dateRange.from)
      const endDate = new Date(dateRange.to)
      
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      const filteredIncome = incomeTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date)
        return transactionDate >= startDate && transactionDate <= endDate
      })

      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.expense_date)
        return expenseDate >= startDate && expenseDate <= endDate
      })

      const dailyDataMap = new Map<string, DailyData>()

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0]
        dailyDataMap.set(dateKey, { income: 0, outcome: 0, clearRevenue: 0 })
      }

      filteredIncome.forEach(transaction => {
        const dateKey = transaction.transaction_date.split('T')[0]
        const existing = dailyDataMap.get(dateKey) || { income: 0, outcome: 0, clearRevenue: 0 }
        existing.income += parseFloat(transaction.amount.toString())
        dailyDataMap.set(dateKey, existing)
      })

      filteredExpenses.forEach(expense => {
        const dateKey = expense.expense_date.split('T')[0]
        const existing = dailyDataMap.get(dateKey) || { income: 0, outcome: 0, clearRevenue: 0 }
        existing.outcome += parseFloat(expense.amount.toString())
        dailyDataMap.set(dateKey, existing)
      })

      const data: ChartData = [['Date', 'Income', 'Outcome', 'Clear Revenue']]
      
      const sortedDates = Array.from(dailyDataMap.keys()).sort()
      
      sortedDates.forEach(dateKey => {
        const daily = dailyDataMap.get(dateKey)!
        daily.clearRevenue = daily.income - daily.outcome
        
        const date = new Date(dateKey)
        const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        
        data.push([dateStr, daily.income, daily.outcome, daily.clearRevenue])
      })

      setChartData(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load chart data'
      toast.error(errorMessage)
      setChartData([['Date', 'Income', 'Outcome', 'Clear Revenue']])
    } finally {
      setLoading(false)
    }
  }, [dateRange, shopId])

  useEffect(() => {
    fetchAndProcessData()
  }, [fetchAndProcessData])

  const handleFilter = () => {
    onDateRangeChange({ from: fromDate, to: toDate })
  }

  const chartOptions = {
    title: shopName ? `${shopName} - Revenue Analysis` : 'All Shops - Revenue Analysis',
    curveType: 'function' as const,
    legend: { position: 'bottom' as const },
    hAxis: {
      title: 'Date',
      slantedText: true,
      slantedTextAngle: 45,
      showTextEvery: Math.max(1, Math.floor((chartData.length - 1) / 15))
    },
    vAxis: {
      title: 'Amount ($)',
      format: 'currency',
      currency: 'USD'
    },
    series: {
      0: { color: '#ef4444', lineWidth: 3 },
      1: { color: '#3b82f6', lineWidth: 3 },
      2: { color: '#22c55e', lineWidth: 3 }
    },
    chartArea: {
      width: '85%',
      height: '70%'
    },
    tooltip: {
      isHtml: true,
      trigger: 'focus',
      textStyle: {
        fontSize: 12
      }
    },
    focusTarget: 'category',
    pointSize: 0,
    enableInteractivity: true
  }

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : chartData.length === 1 ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-gray-500">No data available for the selected date range</div>
          </div>
        ) : (
          <Chart
            chartType="LineChart"
            width="100%"
            height="500px"
            data={chartData}
            options={chartOptions}
          />
        )}
      </div>
    </div>
  )
}

export default RevenueChart

