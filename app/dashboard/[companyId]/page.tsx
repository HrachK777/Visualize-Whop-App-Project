'use client'

import { use, useEffect, useState } from 'react'
import { MetricCard } from '@/components/metrics/MetricCard'

import { formatCurrency } from '@/lib/utils'
import DashboardTabs from '@/components/DashboardTabs'
import { useChartData, HistoricalDataPoint } from '@/lib/hooks/useChartData'
import { usePathname } from 'next/navigation'
import Home from '@/components/tabs/Home'

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

  
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // First, ensure historical data exists (trigger backfill if needed)
        await fetch(`/api/analytics/ensure-backfill?company_id=${companyId}`)

        // Fetch analytics
        const analyticsResponse = await fetch(`/api/analytics?company_id=${companyId}`)
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const data = await analyticsResponse.json()
        setAnalytics(data)
        const historicalResponse = await fetch(`/api/analytics/historical?company_id=${companyId}&days=365`)
        if (!historicalResponse.ok) {
          throw new Error('Failed to fetch historical data')
        }
        const historicalData = await historicalResponse.json()
        console.log('for debug historicalData = ', historicalData);
        setHistoricalData(historicalData.data)
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

  if (!analytics) {
    return null
  }

  return (
    <div className="px-8">
      {/* Top tab bar */}
      <DashboardTabs company_id={companyId} />

      {/* Page content */}
      <div className="min-h-screen bg-[#f7f9fc]">
        <Home />
      </div>
    </div>
  )
}
