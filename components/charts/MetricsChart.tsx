'use client';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Area,
  AreaChart
} from 'recharts';
import { useEffect, useState } from 'react';
import { formatCurrency1, ticksNumber } from '@/lib/utils';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';
import clsx from 'clsx';

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
}) {
  const { data: analytics } = useAnalytics();
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
          <p className="text-2xl font-semibold text-gray-800">{formatCurrency1(data[data.length - 1]?.mrr || 0)}</p>
          <p className="text-gray-500">Current MRR</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(analytics?.mrr.breakdown.monthly)}
            <span className="text-[#1677ff] text-sm font-medium">
              {/* +23.02% */}
            </span>
          </p>
          <p className="text-gray-500">30 days ago</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency1(analytics?.mrr.breakdown.monthly)}
            <span className="text-[#1677ff] text-sm font-medium">
              {/* 0% */}
            </span>
          </p>
          <p className="text-gray-500">60 days ago</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">{formatCurrency1(analytics?.mrr.breakdown.quarterly)}</p>
          <p className="text-gray-500">180 days ago</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">{formatCurrency1(analytics?.mrr.breakdown.annual)}</p>
          <p className="text-gray-500">365 days ago</p>
        </div>
      </div>
    </div>
  );
}
