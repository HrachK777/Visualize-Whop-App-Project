'use client'

import { useEffect, useState } from 'react'
import { SortDescIcon } from 'lucide-react'
import ARRLineChart from '@/components/charts/ARRLineChart'
import NetMRRMovementsChart from '@/components/charts/NetMRRMovementsChart';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext'
import { useMemberships } from '@/lib/contexts/MembershipsContext'
import { CustomerType } from '@/lib/types/analytics';
import { formatCurrency1 } from '@/lib/utils';

export default function DashboardPage({ companyId }: { companyId: string }) {
  // Use shared analytics context - fetched ONCE in layout
  const { data } = useMemberships();
  const { data: analytics, loading, error } = useAnalytics();
  const [customers, setCustomers] = useState<CustomerType[]>([]);

  useEffect(() => {
    if (data && data.memberships) {
      const statusFiltered = data.memberships.filter(m => m.status == 'active');
      const renewalFilteredPlan = data.plans.filter(p => p.planType == 'renewal');
      let count = 0;
      const filtered: any[] = statusFiltered.map(m => {
        // const highestMRR: any = renewalFilteredPlan.reduce((max, current) =>
        //   current.rawRenewalPrice > max.rawRenewalPrice ? current : max, renewalFilteredPlan[0]
        // );
        const planMatches = renewalFilteredPlan.filter(p => p.id == m?.plan?.id);
        return planMatches.map(p => ({
          id: count++,
          name: m.member?.name ? m.member?.name : '—',
          arr: p.billingPeriod== 30 ? p.rawRenewalPrice * 12 : p.rawRenewalPrice,
          billing: p.billingPeriod == 30 ? 'Monthly' : 'Annual',
          country: 'United States',
        }));
      }).flat(); // Use flat() to flatten the array of arrays
      setCustomers(filtered)
    }
  }, [data])

  const thisMonthMovements: any = analytics?.movements && analytics?.movements.monthly[analytics.movements.monthly.length - 1]

  const mrrBreakdown = [
    { label: 'New Business MRR', value: thisMonthMovements && thisMonthMovements.newBusiness, color: 'text-blue-600', count: 0 },
    { label: 'Expansion MRR', value: thisMonthMovements && thisMonthMovements.expansion, color: 'text-blue-500', count: 0 },
    { label: 'Contraction MRR', value: thisMonthMovements && thisMonthMovements.contraction, color: 'text-red-500', count: 0 },
    { label: 'Churn MRR', value: thisMonthMovements && thisMonthMovements.churn, color: 'text-red-600', count: 0 },
    { label: 'Reactivation MRR', value: thisMonthMovements && thisMonthMovements.expansion, color: 'text-gray-500', count: 0 },
  ];

  const net_mrr_movement = thisMonthMovements && thisMonthMovements.net;

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
    <div className="px-8 min-h-screen bg-[#f7f9fc]">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Top Wins */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <span>🏆</span>
              Top wins from this week
            </div>
            <button className="text-xs font-medium text-gray-600 border border-gray-200 px-2 py-1 rounded-md">
              {customers.length} CUSTOMERS
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
              {customers.length > 0 ? customers.map((win: any, i: number) => (
                <tr key={i} className="text-gray-700">
                  <td className="py-2">{win.name}</td>
                  <td className="py-2">{formatCurrency1(win.arr)}</td>
                  <td className="py-2">{win.billing}</td>
                  <td className="py-2">{win.country}</td>
                </tr>
              )) : <tr><td colSpan={4} className="py-5 text-center text-gray-500">No top wins this week</td></tr>}
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
                  <span className='text-gray-700'>{item.label}</span>
                </div>
                <span className="font-medium text-gray-700">${(item.value)?.toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between font-semibold text-gray-800 px-4">
              <div className='gap-10'>
                <span>Net MRR Movement</span>
              </div>
              <span>${net_mrr_movement.toFixed(2)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-gray-600 px-4">
              <div className='flex gap-10'>
                <span>0</span>
                <span>Scheduled MRR Movements</span>
              </div>
              <span>$0</span>
            </div>
          </div>
        </div>

        {/* Bottom Left - Net MRR Movements */}
        <NetMRRMovementsChart NetMRRData={analytics.movements.monthly} />

        {/* Bottom Right - Annual Run Rate */}
        <ARRLineChart ARRData={analytics.historical} growth={0} />
      </div>
    </div>
  )
}
