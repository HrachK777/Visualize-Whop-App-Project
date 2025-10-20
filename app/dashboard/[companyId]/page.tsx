'use client'

import { use, useEffect, useState } from 'react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { Settings, Trophy, SortDescIcon, PlusIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import DashboardTabs from '@/components/DashboardTabs'
import { useChartData, HistoricalDataPoint } from '@/lib/hooks/useChartData'
import { usePathname } from 'next/navigation'
import ARRLineChart from '@/components/charts/ARRLineChart'
import NetMRRMovementsChart from '@/components/charts/NetMRRMovementsChart';

interface AnalyticsData {
  mrr: {
    total: number
    breakdown: {
      monthly: number
      annual: number
      quarterly: number
      other: number
    }
  }
  arr: number
  arpu: number
  subscribers: {
    active: number
    cancelled: number
    past_due: number
    trialing: number
    total: number
  }
  activeUniqueSubscribers: number
  cached?: boolean
  timestamp?: string
  snapshotDate?: string
}

export default function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [historicalLoading, setHistoricalLoading] = useState(false)
  const [dailyLoading, setDailyLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const pathname = usePathname();

  const topWins = [
    { customer: 'Ethan C Welsh', arr: '$1,440', billing: 'Monthly', country: 'United States' },
    { customer: 'MD SHAHID B EMDAD', arr: '$288', billing: 'Monthly', country: 'United States' },
  ];

  const mrrBreakdown = [
    { label: 'New Business MRR', value: '$144', color: 'text-blue-600', count: 2 },
    { label: 'Expansion MRR', value: '$648', color: 'text-blue-500', count: 6 },
    { label: 'Contraction MRR', value: '-$30', color: 'text-red-500', count: 1 },
    { label: 'Churn MRR', value: '-$180', color: 'text-red-600', count: 2 },
    { label: 'Reactivation MRR', value: '$0', color: 'text-gray-500', count: 0 },
  ];

  
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // First, ensure historical data exists (trigger backfill if needed)
        // await fetch(`/api/analytics/ensure-backfill?company_id=${companyId}`)

        // // Fetch analytics
        // const analyticsResponse = await fetch(`/api/analytics?company_id=${companyId}`)
        // if (!analyticsResponse.ok) {
        //   throw new Error('Failed to fetch analytics')
        // }
        // const data = await analyticsResponse.json()
        // setAnalytics(data)
        // const historicalResponse = await fetch(`/api/analytics/historical?company_id=${companyId}&days=365`)
        // if (!historicalResponse.ok) {
        //   throw new Error('Failed to fetch historical data')
        // }
        // const historicalData = await historicalResponse.json()
        console.log('for debug historicalData = ');
        // setHistoricalData(historicalData.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  // if (!analytics) {
  //   return null
  // }

  return (
    <div className="px-8 min-h-screen bg-[#f7f9fc]">
      {/* Page content */}
        {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Home <Settings className="h-5 w-5 text-gray-400" />
        </h1>
        <div className="grid grid-cols-2 items-center m-3 border border-gray-200 rounded-md divide-x-2 divide-gray-200 bg-white">
          <button className='hover:bg-gray-100 cursor-pointer'>
            <SortDescIcon className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
          <button className='hover:bg-gray-100 cursor-pointer'>
            <PlusIcon className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Top Wins */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <Trophy className="text-yellow-500 h-5 w-5" />
              Top wins from this week
            </div>
            <button className="text-xs font-medium text-gray-600 border border-gray-200 px-2 py-1 rounded-md">
              2 CUSTOMERS
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Customer</th>
                <th className="py-2">
                  ARR
                  <SortDescIcon className="inline-block ml-1 w-3 h-3" />
                </th>
                <th className="py-2">Billing Cycle</th>
                <th className="py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {topWins.map((win, i) => (
                <tr key={i} className="text-gray-700">
                  <td className="py-2">{win.customer}</td>
                  <td className="py-2">{win.arr}</td>
                  <td className="py-2">{win.billing}</td>
                  <td className="py-2">{win.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right MRR Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">MRR Breakdown</h2>
            <select
              className="text-sm border border-gray-200 text-gray-600 rounded-md px-1 py-1"
              defaultValue="this_month"
              aria-label="Select time range"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
            </select>
          </div>

          <div className="space-y-4 text-sm">
            {mrrBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between px-4">
                <div className='flex gap-10'>
                  <span className={item.color}>{item.count}</span>
                  <span>{item.label}</span>
                </div>
                <span className="font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between font-semibold text-gray-800 px-4">
              <div className='gap-10'>
                <span>Net MRR Movement</span>
              </div>
              <span>$582</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-gray-600 px-4">
              <div className='flex gap-10'>
                <span>3</span>
                <span>Scheduled MRR Movements</span>
              </div>
              <span>-$132</span>
            </div>
          </div>
        </div>

        {/* Bottom Left - Net MRR Movements */}
          <NetMRRMovementsChart />

        {/* Bottom Right - Annual Run Rate */}
            <ARRLineChart />
      </div>
    </div>
  )
}
