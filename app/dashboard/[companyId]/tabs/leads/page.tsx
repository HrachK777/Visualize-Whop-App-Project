'use client';

import { Settings } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';
import { ticksNumber, formatCurrency } from '@/lib/utils';

// Mock data for charts
const mockData = [
  { day: 'Oct 1', value: 0 },
  { day: 'Oct 5', value: 0 },
  { day: 'Oct 10', value: 0 },
  { day: 'Oct 15', value: 0 },
  { day: 'Oct 20', value: 0 },
  { day: 'Oct 25', value: 0 },
];

export default function LeadsTrialsPage() {
  const { data: analytics, loading, error, refetch } = useAnalytics();
  const data = analytics?.historical || mockData;
  const CustomizedLabel = ({ x, y, value, index }: any) => {
    if (index % 3 === 0 || index == data.length - 1) {
      return (
        <text
          x={x - 5}
          y={y}
          dy={-10}
          // fill={COLORS.line}
          fontSize={13}
          fontWeight="bold"
        >
          {value}
        </text>
      );
    }
    return null;
  };
  return (
    <div className="bg-[#f7f9fc] px-8 pb-8">
      {/* Grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className='space-y-5'>
          {/* Leads Chart */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center text-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="cursor-grab">⋮⋮</span> Leads
                <Settings className="h-4 w-4 text-gray-400" />
              </h2>
              <div className="flex gap-10 md:gap-20">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.length > 0 && data.map(item => item?.trials?.total).reduce((a, b) => a + b, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <p className="text-xs text-gray-400">
                  <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                  Prev 30 days </p>
              </div>
            </div>
            <div className="h-[130px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid stroke="#f0f2f5" vertical={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="linear"
                    dataKey="trials.total"
                    stroke="#0f2940"
                    strokeWidth={2}
                    dot={{ fill: '#0f2940', r: 3 }}
                    activeDot={{ r: 5 }}
                    label={CustomizedLabel}
                    name="trials"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Free Trials */}
          <div className="bg-white rounded-lg shadow-sm p-5 items-center text-center">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Free Trials</h2>
              <div className="flex gap-10 md:gap-20">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.length > 0 && data.map(item => item?.trials?.total).reduce((a, b) => a + b, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <p className="text-xs text-gray-400">
                  <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                  Prev 30 days </p>
              </div>
            </div>
            <div className="h-[130px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} >
                  <CartesianGrid stroke="#f0f2f5" vertical={false} />
                  <Line
                    type="linear"
                    dataKey="trials.total"
                    stroke="#0f2940"
                    strokeWidth={2}
                    dot={{ fill: '#0f2940', r: 3 }}
                    activeDot={{ r: 5 }}
                    label={CustomizedLabel}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='space-y-5 justify-between'>

          {/* Trial-to-paid cohorts chart */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <span className="text-xl">🤑</span>
              Trial-to-paid cohorts
            </h2>
            <div className="h-[300px] pb-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid stroke="#f0f2f5" vertical={false} />
                  <Line
                    type="linear"
                    dataKey="trials.conversionRate"
                    stroke="#6d28d9"
                    strokeWidth={2}
                    dot={{ fill: '#6d28d9', r: 3 }}
                    activeDot={{ r: 5 }}
                    label={CustomizedLabel}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Sales Cycle Length */}
          <div className="flex bg-white rounded-lg shadow-sm p-5 justify-between items-center text-center">
            <h2 className="font-semibold text-gray-800">
              Average Sales Cycle Length
            </h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {data.map(item => item.avgSalesPrice).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                Prev 30 days </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
