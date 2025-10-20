'use client';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Area
} from 'recharts';
import { useState } from 'react';
import { LineChartIcon, BarChart2 } from 'lucide-react';

export default function MetricChart({
  onGroupingChange,
  onViewChange,
  data,
  dataKey = 'value',
  lineColor = '#0f2940',
  fillColor = '#1677ff',
  type = 'line',
  currentView,
  currentGroup,
}: {
  onViewChange: (view: 'line' | 'bar') => void;
  onGroupingChange: (group: 'day' | 'week' | 'month' | 'quarter' | 'year') => void;
  data: { date: string; value: number }[];
  dataKey?: string;
  lineColor?: string;
  fillColor?: string;
  type?: 'line' | 'bar';
  currentView: 'line' | 'bar';
  currentGroup: 'day' | 'week' | 'month' | 'quarter' | 'year';
}) {
  

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {/* Chart type and time grouping */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => onViewChange('line')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ${currentView === 'line'
                ? 'bg-[#1677ff] text-white'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <LineChartIcon className="h-4 w-4" /> LINE
          </button>
          <button
            onClick={() => onViewChange('bar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ${currentView === 'bar'
                ? 'bg-[#1677ff] text-white'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <BarChart2 className="h-4 w-4" /> BAR
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-1 flex">
          {['day', 'week', 'month', 'quarter', 'year'].map((grp) => (
            <button
              key={grp}
              onClick={() => onGroupingChange(grp as any)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentGroup === grp
                  ? 'bg-[#1677ff] text-white'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {grp.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="date"  />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
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
            <LineChart data={data}>
              <defs>
                <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Area type="monotone" dataKey={dataKey} fill="url(#metricFill)" />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: lineColor }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
