'use client';

import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import Loading from '@/components/ui/loading';
import ErrorComponent from '@/components/ui/error';
import { useEffect } from 'react';
import { useMemberships } from '@/lib/contexts/MembershipsContext';
import { ymd, formatCurrency1 } from '@/lib/utils';
import { CustomerType } from '@/lib/types/analytics';
import { HistoricalDataPoint } from '@/lib/hooks/useChartData'
import { useAnalytics } from '@/lib/contexts/AnalyticsContext'

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
  plans: Array<{ id: string; name: string }>
  timestamp: string,
  movements: {
    monthly: Array<{}>
  }
}

export default function CashFlowPage({ params }: { params: Promise<{ companyId: string }> }) {
  const [pastDueCustomers, setPastDueCustomers] = useState<{ name: string, due: string, renewal: string, arr: string }[]>([]);
  const { data } = useMemberships();
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  // const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  // const [loading, setLoading] = useState(true)
  const { data: analytics, loading, error } = useAnalytics();

  useEffect(() => {
    if(analytics) setHistoricalData(analytics.historical);

    if (data && data.memberships) {
      const statusFiltered = data.memberships.filter(m => m.status == 'past_due');
      let count = 0;
      const filtered: any[] = statusFiltered.map(m => {
        const planMatches = data.plans.filter(p => p.id == m?.plan?.id);
        return planMatches.map(p => ({
          id: count++,
          name: m.member?.name ? m.member?.name : '—',
          arr: p.rawRenewalPrice * 12,
          pastDueAt: m.createdAt,
          renewalAt: m.expiresAt,
        }));
      }).flat(); // Use flat() to flatten the array of arrays
      setCustomers(filtered)
    }
  }, [data]);

  const thisMonthRefunds = historicalData[historicalData.length - 1].refunds || 0;
  const prevMonthRefunds = historicalData[historicalData.length - 2].refunds || 0;
  const thisMonthNetCashFlow = historicalData[historicalData.length - 1].cashFlow || 0;
  const prevMonthNetCashFlow = historicalData[historicalData.length - 2].cashFlow || 0;
  const gross = (thisMonthNetCashFlow - prevMonthNetCashFlow) / prevMonthNetCashFlow * 100
  const refundsRate = (thisMonthRefunds - prevMonthRefunds) / prevMonthRefunds * 100


  // useEffect(() => {
  //   params.then((p) => {
  //     fetch(`/api/analytics/cached?company_id=${p.companyId}`)
  //       .then(res => res.json())
  //       .then((currentData) => {
  //         setAnalytics(currentData as AnalyticsData)
  //         setHistoricalData(currentData.historical || []) // No historical data for now
  //         setLoading(false)
  //       })
  //       .catch(() => {
  //         setLoading(false)
  //       })
  //   })
  // }, [params])

  if (loading) return <Loading />;

  return (
    <div className="flex flex-wrap gap-6 bg-[#f7f9fc] px-6 pb-5">
      {/* Left column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[600px]">
        {/* Net Cash Flow */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800">Net Cash Flow</h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ${thisMonthNetCashFlow.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-blue-600 font-bold'>
                  {gross.toFixed(2)}%
                </strong><br />
                Prev 30 days</p>
            </div>
          </div>

          <div className='h-[150px]'>
            <ResponsiveContainer width="100%">
              <BarChart data={historicalData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
                <Tooltip />
                <Bar dataKey="cashFlow" fill="#0f2940" radius={[4, 4, 0, 0]} barSize={25} />
                {/* <Bar dataKey="previous" fill="url(#patternGray)" barSize={25} /> */}
                <defs>
                  <pattern
                    id="patternGray"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                  >
                    <rect width="6" height="6" fill="#94a3b8" opacity="0.2" />
                    <path d="M0 0L6 6ZM-1 5L5 -1ZM5 7L7 5Z" stroke="#475569" strokeWidth="0.5" />
                  </pattern>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compounding Cashflows */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            💸 Compounding cashflows
          </h2>

          <div className='h-[230px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
                <Tooltip />
                <Bar dataKey="cashFlow" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                {/* <Bar dataKey="previous" fill="url(#patternRed)" barSize={25} /> */}
                <defs>
                  <pattern
                    id="patternRed"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                  >
                    <rect width="6" height="6" fill="#fecaca" opacity="0.3" />
                    <path d="M0 0L6 6ZM-1 5L5 -1ZM5 7L7 5Z" stroke="#ef4444" strokeWidth="0.5" />
                  </pattern>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[500px]">
        {/* Past Due Customers */}
        <div className="bg-white rounded-lg shadow-sm p-5 min-h-[300px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex font-semibold text-gray-800 flex items-center gap-2">
              <span>🚨</span>
              Past Due Customers
            </h2>
            <span className="text-xs font-semibold text-gray-600 border border-gray-200 rounded px-2 py-0.5">
              {customers.length} CUSTOMERS
            </span>
          </div>
          <table className="w-full text-sm text-gray-700">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Past Due Date</th>
                <th className="text-left py-2">Renewal Date</th>
                <th className="text-right py-2">ARR</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map((c, i) => (
                <tr key={i}>
                  <td className="py-2">{c.name}</td>
                  <td>{c.pastDueAt}</td>
                  <td>{c.renewalAt}</td>
                  <td className="text-right">{formatCurrency1(c.arr)}</td>
                </tr>
              )) : <tr><td colSpan={4} className="text-center py-2">No past due customers</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Refunds */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800">Refunds</h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  ${thisMonthRefunds.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-blue-600 font-bold'>
                  {refundsRate.toFixed(2)}%
                </strong><br />
                Prev 30 days</p>
            </div>
          </div>
          <div className='h-[150px]'>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
                <Tooltip />
                <Bar dataKey="refunds" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                {/* <Bar dataKey="previous" fill="url(#patternRed)" barSize={25} /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
