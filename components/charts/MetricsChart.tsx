'use client';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Area,
  AreaChart
} from 'recharts';
import { formatCurrency1, ticksNumber } from '@/lib/utils';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';

export default function MetricChart({
  onGroupingChange,
  onViewChange,
  data,
  dataKey = 'value',
  lineColor = '#0f2940',
  fillColor = '#D9F2FE',
  type = 'line',
  currentView,
  currentGroup,
  aMonthAgo,
  twoMonthsAgo,
  threeMonthsAgo,
  currentValue
}: {
  onViewChange: (view: 'line' | 'bar') => void;
  onGroupingChange: (group: 'day' | 'week' | 'month' | 'quarter' | 'year') => void;
  data: any[];
  dataKey?: string;
  lineColor?: string;
  fillColor?: string;
  type?: 'line' | 'bar';
  currentView: 'line' | 'bar';
  currentGroup: 'day' | 'week' | 'month' | 'quarter' | 'year';
  aMonthAgo: number;
  twoMonthsAgo: number;
  threeMonthsAgo: number;
  currentValue: number;
}) {
  const { data: analytics } = useAnalytics();
  const annualMRR = analytics?.mrr.breakdown.annual || 0;
  const gross1 = aMonthAgo !== 0 ? (currentValue - aMonthAgo) / aMonthAgo * 100 : 0;
  const gross2 = twoMonthsAgo !== 0 ? (currentValue - twoMonthsAgo) / twoMonthsAgo * 100 : 0;
  const gross3 = threeMonthsAgo !== 0 ? (currentValue - threeMonthsAgo) / threeMonthsAgo * 100 : 0;
  const gross4 = annualMRR !== 0 ? (currentValue - annualMRR) / annualMRR * 100 : 0;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {/* Chart type and time grouping */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex border border-gray-700 rounded-md">
          <button
            onClick={() => onViewChange('line')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-l-md text-sm font-medium ${currentView === 'line'
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            LINE
          </button>
          <button
            onClick={() => onViewChange('bar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-r-md text-sm font-medium ${currentView === 'bar'
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            BAR
          </button>
        </div>

        <div className="flex border border-gray-700 rounded-md">
          {['day', 'week', 'month', 'quarter', 'year'].map((grp) => (
            <button
              key={grp}
              onClick={() => onGroupingChange(grp as any)}
              className={`px-3 py-1.5 text-sm font-medium ${currentGroup === grp
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {grp.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className='h-[320px]'>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="date" ticks={ticksNumber(data, 'date')}
                interval="preserveStartEnd" // ensures first & last labels show
                minTickGap={20}
                tick={{ dy: 10 }}
              />
              <YAxis dataKey={dataKey} tickFormatter={(value) => formatCurrency1(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart width={730} height={250} data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date"
                ticks={ticksNumber(data, 'date')}
                interval="preserveStartEnd" // ensures first & last labels show
                minTickGap={20}
                tick={{ dy: 10 }}
              />
              <YAxis dataKey={dataKey} tickFormatter={(value) => formatCurrency1(value)} />
              <Tooltip />
              <Area type="linear" dataKey={dataKey} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
              <Line
                type="linear"
                dataKey={dataKey}
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: lineColor }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* MRR Summary Section */}
      <div className="flex justify-around border-t mt-6 pt-4 text-sm">
        <div>
          <p className="text-2xl font-semibold text-gray-800">{formatCurrency1(currentValue)}</p>
          <p className="text-gray-500">Current Value</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(aMonthAgo)}
            <span className="text-[#1677ff] text-sm font-medium">
              {gross1 !== 0 ? `${gross1.toFixed(2)} %` : null}
            </span>
          </p>
          <p className="text-gray-500">30 days ago</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(twoMonthsAgo)}
            <span className="text-[#1677ff] text-sm font-medium">
              {gross2 !== 0 ? `${gross2.toFixed(2)} %` : null}
            </span>
          </p>
          <p className="text-gray-500">60 days ago</p>
        </div>
        <div>
         <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(threeMonthsAgo)}
            <span className="text-[#1677ff] text-sm font-medium">
              {gross3 !== 0 ? `${gross3.toFixed(2)} %` : null}
            </span>
          </p>
          <p className="text-gray-500">180 days ago</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(annualMRR)}
            <span className="text-[#1677ff] text-sm font-medium">
              {gross4 !== 0 ? `${gross4.toFixed(2)} %` : null}
            </span>
          </p>
          <p className="text-gray-500">365 days ago</p>
        </div>
      </div>
    </div>
  );
}
