'use client';

import { Settings } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, AreaChart,
  Tooltip, ResponsiveContainer, CartesianGrid, Area
} from 'recharts';
import { useAnalytics } from '@/lib/contexts/AnalyticsContext';

export default function ChurnRetention() {
  const { data: analytics, loading, error, refetch } = useAnalytics();
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('en-US', { month: 'long' });
  const data = analytics?.historical as any;
  console.log('for debug analytics:', analytics);

  const CustomizedLabel = ({ x, y, value, index }: any) => {
    if (index % 3 === 0 || index == data.length - 1) {
      return (
        <text
          x={x - 5}
          y={y}
          dy={value < 0 ? 10 : -10}
          fill="#0f2940"
          fontSize={13}
          fontWeight="bold"
        >
          {`${value}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-wrap gap-6 bg-[#f7f9fc] px-6">
      {/* Left column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[600px]">
        {/* Net MRR Churn Rate */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800 mb-2">Net MRR Churn Rate</h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">{analytics?.churnedMRR.rate}%</p>
                <p className="text-xs text-gray-500">{currentMonth}</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                From {prevMonth}</p>
            </div>
          </div>
          <div className='h-[150px]'>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data}  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677ff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1677ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <Tooltip />
                <Area type="linear" dataKey="churnedMRR" stroke="none" fill="url(#blueFill)" />
                {/* <Area type="linear" dataKey="churnedMRR" stroke="none" fill="url(#blueFill)" /> */}
                <Line
                  type="linear"
                  dataKey="churnedMRR"
                  stroke="#0f2940"
                  strokeWidth={2}
                  dot={{ fill: '#0f2940', r: 3 }}
                  // connectNulls={false}
                  label={CustomizedLabel}
                />
                {/* <Line 
                type="linear" 
                dataKey="churnedMRR" 
                stroke="#0f2940" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ fill: '#0f2940', r: 3 }} 
                connectNulls={false}
                label={<CustomizedLabel />}
              /> */}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn rate sliced by price */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="flex gap-2 font-semibold text-gray-800 mb-2 text-gray-600">
            ❌ Churn rate sliced by price
            <Settings className="h-5 w-5 text-gray-400" />
          </h2>
          <div className='h-[170px]'>
            <ResponsiveContainer width="100%" height="100%" className="pr-2">
              <LineChart data={data}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <Tooltip />
                <Line
                  type="linear"
                  dataKey="churnedMRR"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316', r: 3 }}
                  connectNulls={false}
                />
                {/* <Line 
                  type="linear" 
                  dataKey="projected" 
                  stroke="#0f2940" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#0f2940', r: 3 }} 
                  connectNulls={false}
                />
                <Line 
                  type="linear" 
                  dataKey="yellow" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#f97316', r: 3 }} 
                  connectNulls={false}
                />
                <Line 
                  type="linear" 
                  dataKey="black" 
                  stroke="#0f2940" 
                  strokeWidth={2} 
                  dot={{ fill: '#0f2940', r: 3 }} 
                  connectNulls={false}
                /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[500px]">
        {/* Paid Subscriber Churn Rate */}
        <div className="bg-white rounded-lg shadow-sm p-5 w-full">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Paid Subscriber Churn Rate
            </h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">{analytics?.churnedMRR.rate}%</p>
                <p className="text-xs text-gray-500">{currentMonth}</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                From {prevMonth}</p>
            </div>
          </div>
          <div className='h-[150px]'>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f0a9b5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f0a9b5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} interval="preserveStartEnd" /> */}
                <Tooltip />
                <Area type="linear" dataKey="actual" stroke="none" fill="url(#pinkFill)" />
                <Area type="linear" dataKey="projected" stroke="none" fill="url(#pinkFill)" />
                <Line
                  type="linear"
                  dataKey="churnedMRR"
                  stroke="#0f2940"
                  strokeWidth={2}
                  dot={{ fill: '#0f2940', r: 3 }}
                  connectNulls={false}
                  label={CustomizedLabel}
                />
                <Line
                  type="linear"
                  dataKey="projected"
                  stroke="#0f2940"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#0f2940', r: 3 }}
                  connectNulls={false}
                // label={(props) => <CustomizedLabel {...props} dataLength={subscriberData.length} />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscriber cohorts */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[240px]">
          <h2 className="font-semibold text-gray-800 mb-2">👥 Subscriber cohorts</h2>
          <div className='h-[170px]'>
            <ResponsiveContainer width="100%" height="100%" className="pr-2">
              <LineChart data={data}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <Tooltip />
                <Line
                  type="linear"
                  dataKey="churnedMRR"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#a78bfa' }}
                />
                <Line
                  type="linear"
                  dataKey="chrunedMRR"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}