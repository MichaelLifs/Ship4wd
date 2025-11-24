import { useState } from 'react'
import { Chart } from 'react-google-charts'

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

function RevenueChart({ dateRange, onDateRangeChange, shopId, shopName }: RevenueChartProps) {
  const [fromDate, setFromDate] = useState(dateRange.from)
  const [toDate, setToDate] = useState(dateRange.to)

  const generateMockData = (): ChartData => {
    const data: ChartData = [['Date', 'Income', 'Outcome', 'Clear Revenue']]
    
    const startDate = new Date(dateRange.from)
    const endDate = new Date(dateRange.to)
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      const income = Math.floor(Math.random() * 5000) + 2000
      const outcome = Math.floor(Math.random() * 3000) + 1000
      const clearRevenue = income - outcome
      
      data.push([dateStr, income, outcome, clearRevenue])
    }
    
    return data
  }

  const handleFilter = () => {
    onDateRangeChange({ from: fromDate, to: toDate })
  }

  const chartData = generateMockData()

  const chartOptions = {
    title: shopName ? `${shopName} - Revenue Analysis` : 'Shop Revenue Analysis',
    curveType: 'function' as const,
    legend: { position: 'bottom' as const },
    hAxis: {
      title: 'Date',
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: 'Amount (₪)'
    },
    series: {
      0: { color: '#ef4444', lineWidth: 3 },
      1: { color: '#3b82f6', lineWidth: 3 },
      2: { color: '#22c55e', lineWidth: 3 }
    },
    chartArea: {
      width: '85%',
      height: '70%'
    }
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
        <Chart
          chartType="LineChart"
          width="100%"
          height="500px"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  )
}

export default RevenueChart

