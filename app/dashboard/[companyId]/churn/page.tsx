'use client';

import { Settings } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area
} from 'recharts';

const data = Array.from({ length: 12 }).map((_, i) => ({
  month: `M${i + 1}`, value: Math.random() * 5,
}));

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
                <p className="text-2xl font-bold text-gray-800">-183.5%</p>
                <p className="text-xs text-gray-500">September</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-gray-800 font-bold'>—</strong><br />
                From August</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f2940" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0f2940" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              {/* <YAxis tickLine={false} axisLine={false} /> */}
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="none" fill="url(#blueFill)" />
              <Line type="monotone" dataKey="value" stroke="#0f2940" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Churn rate sliced by price */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[240px]">
          <h2 className="flex gap-2 font-semibold text-gray-800 mb-2 text-gray-600">
            ❌ Churn rate sliced by price
            <Settings className="h-5 w-5 text-gray-400" />
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              {/* <XAxis dataKey="month" tickLine={false} axisLine={false} /> */}
              {/* <YAxis tickLine={false} axisLine={false} /> */}
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f97316" dot={{ fill: '#f97316', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
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

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0a9b5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f0a9b5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              {/* <YAxis tickLine={false} axisLine={false} /> */}
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="none" fill="url(#pinkFill)" />
              <Line type="monotone" dataKey="value" stroke="#0f2940" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriber cohorts */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[240px]">
          <h2 className="font-semibold text-gray-800 mb-2">👥 Subscriber cohorts</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              {/* <XAxis dataKey="month" tickLine={false} axisLine={false} /> */}
              {/* <YAxis tickLine={false} axisLine={false} /> */}
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ef4444" dot={{ r: 3, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
