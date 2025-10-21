'use client';

import { Settings } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, AreaChart,
  Tooltip, ResponsiveContainer, CartesianGrid, Area
} from 'recharts';

// Data for Net MRR Churn Rate - showing solid line at 0% then drop with dotted projection
const mrrData = [
  { month: 'M1', actual: 0, projected: null },
  { month: 'M2', actual: 0, projected: null },
  { month: 'M3', actual: 0, projected: null },
  { month: 'M4', actual: 0, projected: null },
  { month: 'M5', actual: 0, projected: null },
  { month: 'M6', actual: 0, projected: null },
  { month: 'M7', actual: 0, projected: null },
  { month: 'M8', actual: 0, projected: null },
  { month: 'M9', actual: -183.85, projected: -183.85 },
  { month: 'M10', actual: null, projected: -14.12 },
];

// Data for Paid Subscriber Churn Rate
const subscriberData = [
  { month: 'M1', actual: 0, projected: null },
  { month: 'M2', actual: 0, projected: null },
  { month: 'M3', actual: 0, projected: null },
  { month: 'M4', actual: 0, projected: null },
  { month: 'M5', actual: 0, projected: null },
  { month: 'M6', actual: 0, projected: null },
  { month: 'M7', actual: 0, projected: null },
  { month: 'M8', actual: 0, projected: null },
  { month: 'M9', actual: 0, projected: null },
  { month: 'M10', actual: 19.05, projected: 19.05 },
  { month: 'M11', actual: null, projected: 5.79 },
];

// Data for Churn rate sliced by price - shows flat orange line with uptick and dotted projection
const priceChurnData = [
  { month: 'M1', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M2', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M3', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M4', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M5', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M6', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M7', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M8', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M9', actual: 2, projected: null, yellow: null, black: null },
  { month: 'M10', actual: 2, projected: null, yellow: null, black: 2},
  { month: 'M11', actual: 5.5, projected: 11, yellow: 5.5, black: 11 },
  { month: 'M12', actual: null, projected: 6.2, yellow: 3.5, black: null },
];

// Data for Subscriber cohorts - multiple colored lines
const cohortData = [
  { month: 'M1', red: 1, purple: 1 },
  { month: 'M2', red: 1, purple: 1 },
  { month: 'M3', red: 1, purple: 1 },
  { month: 'M4', red: 1, purple: 1 },
  { month: 'M5', red: 1, purple: 1 },
  { month: 'M6', red: 1, purple: 1 },
  { month: 'M7', red: 1, purple: 1 },
  { month: 'M8', red: 1, purple: 1 },
  { month: 'M9', red: 1, purple: 1 },
  { month: 'M10', red: 1, purple: 1 },
  { month: 'M11', red: 4.8, purple: 1 },
  { month: 'M12', red: 4.8, purple: 1 },
];

const CustomizedLabel = ({ x, y, value, index, dataLength }: any) => {
  if (index === dataLength - 1 && value !== null) {
    return (
      <text
        x={x - 35}
        y={y}
        dy={value < 0 ? 10 : -10}
        fill="#0f2940"
        fontSize={13}
        fontWeight="bold"
      >
        {`${value.toFixed(2)}%`}
      </text>
    );
  }
  return null;
};

export default function ChurnRetention() {
  return (
    <div className="flex flex-wrap gap-6 bg-[#f7f9fc] px-6">
      {/* Left column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[600px]">
        {/* Net MRR Churn Rate */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[240px]">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800 mb-2">Net MRR Churn Rate</h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">-183.85%</p>
                <p className="text-xs text-gray-500">September</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                From August</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="90%" className="pr-2">
            <AreaChart data={mrrData}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677ff" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1677ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="linear" dataKey="actual" stroke="none" fill="url(#blueFill)" />
              <Area type="linear" dataKey="projected" stroke="none" fill="url(#blueFill)" />
              <Line 
                type="linear" 
                dataKey="actual" 
                stroke="#0f2940" 
                strokeWidth={2} 
                dot={{ fill: '#0f2940', r: 3 }} 
                connectNulls={false}
              />
              <Line 
                type="linear" 
                dataKey="projected" 
                stroke="#0f2940" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ fill: '#0f2940', r: 3 }} 
                connectNulls={false}
                label={(props) => <CustomizedLabel {...props} dataLength={mrrData.length} />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Churn rate sliced by price */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="flex gap-2 font-semibold text-gray-800 mb-2 text-gray-600">
            ❌ Churn rate sliced by price
            <Settings className="h-5 w-5 text-gray-400" />
          </h2>
          <div className='h-[170px]'>
            <ResponsiveContainer width="100%" height="100%" className="pr-2">
              <LineChart data={priceChurnData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <Tooltip />
                <Line 
                  type="linear" 
                  dataKey="actual" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  dot={{ fill: '#f97316', r: 3 }} 
                  connectNulls={false}
                />
                <Line 
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6 flex-[1_1_0%] min-w-[500px]">
        {/* Paid Subscriber Churn Rate */}
        <div className="bg-white rounded-lg shadow-sm p-5 w-full h-[240px]">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Paid Subscriber Churn Rate
            </h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-2xl font-bold text-gray-800">19.05%</p>
                <p className="text-xs text-gray-500">September</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                From August</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="90%" className="pr-2">
            <AreaChart data={subscriberData}>
              <defs>
                <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0a9b5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f0a9b5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="linear" dataKey="actual" stroke="none" fill="url(#pinkFill)" />
              <Area type="linear" dataKey="projected" stroke="none" fill="url(#pinkFill)" />
              <Line 
                type="linear" 
                dataKey="actual" 
                stroke="#0f2940" 
                strokeWidth={2} 
                dot={{ fill: '#0f2940', r: 3 }} 
                connectNulls={false}
              />
              <Line 
                type="linear" 
                dataKey="projected" 
                stroke="#0f2940" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={{ fill: '#0f2940', r: 3 }} 
                connectNulls={false}
                label={(props) => <CustomizedLabel {...props} dataLength={subscriberData.length} />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriber cohorts */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[240px]">
          <h2 className="font-semibold text-gray-800 mb-2">👥 Subscriber cohorts</h2>
          <div className='h-[170px]'>
            <ResponsiveContainer width="100%" height="100%" className="pr-2">
              <LineChart data={cohortData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                <Tooltip />
                <Line 
                  type="linear" 
                  dataKey="purple" 
                  stroke="#a78bfa" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#a78bfa' }} 
                />
                <Line 
                  type="linear" 
                  dataKey="red" 
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