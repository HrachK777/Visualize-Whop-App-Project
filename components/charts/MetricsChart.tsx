'use client';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Area,
  AreaChart
} from 'recharts';
import { useState } from 'react';
import { LineChartIcon, BarChart2 } from 'lucide-react';

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
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
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
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
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
    </div>
  );
}
