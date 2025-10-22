'use client';

import { Settings } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RiAlarmWarningFill } from "react-icons/ri";


const netCashFlowData = [
  { month: 'Aug', current: 0, previous: 0 },
  { month: 'Sep', current: 0, previous: 0 },
  { month: 'Oct', current: 7164, previous: 5000 },
];

const compoundingCashflowsData = [
  { month: 'Aug', current: 0, previous: 0 },
  { month: 'Sep', current: 0, previous: 0 },
  { month: 'Oct', current: 4000, previous: 2500 },
];

const refundsData = [
  { month: 'Aug', current: 0, previous: 0 },
  { month: 'Sep', current: 0, previous: 0 },
  { month: 'Oct', current: 237, previous: 320 },
];

const pastDueCustomers = [
  { name: 'Sam Romanias', due: 'Oct 15, 2025', renewal: 'Nov 15, 2025', arr: '$1,440' },
  { name: 'Yarom Peretz', due: 'Oct 13, 2025', renewal: 'Nov 13, 2025', arr: '$1,440' },
  { name: 'Johnathan Mcilvain', due: 'Oct 11, 2025', renewal: 'Nov 11, 2025', arr: '$1,440' },
  { name: 'Ethan Welsh', due: 'Oct 11, 2025', renewal: 'Nov 11, 2025', arr: '$1,440' },
  { name: 'Steven Ezon', due: 'Oct 11, 2025', renewal: 'Nov 11, 2025', arr: '$1,440' },
  { name: 'Sohaib Khan', due: 'Oct 3, 2025', renewal: 'Nov 3, 2025', arr: '$1,440' },
];

export default function CashFlowPage() {
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
                <p className="text-2xl font-bold text-gray-800">$7,164</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-blue-600 font-bold'>+45.13%</strong><br />
                Prev 30 days</p>
            </div>
          </div>

          <div className='h-[150px]'>
            <ResponsiveContainer width="100%">
              <BarChart data={netCashFlowData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
                <Tooltip />
                <Bar dataKey="current" fill="#0f2940" radius={[4, 4, 0, 0]} barSize={25} />
                <Bar dataKey="previous" fill="url(#patternGray)" barSize={25} />
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

          <div className='h-[250px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compoundingCashflowsData}>
                <CartesianGrid stroke="#f0f2f5" vertical={false} />
                {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
                <Tooltip />
                <Bar dataKey="current" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                <Bar dataKey="previous" fill="url(#patternRed)" barSize={25} />
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
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex font-semibold text-gray-800 flex items-center gap-2">
              <span>🚨</span>
              Past Due Customers
            </h2>
            <span className="text-xs font-semibold text-gray-600 border border-gray-200 rounded px-2 py-0.5">
              {pastDueCustomers.length} CUSTOMERS
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
              {pastDueCustomers.map((c, i) => (
                <tr key={i}>
                  <td className="py-2">{c.name}</td>
                  <td>{c.due}</td>
                  <td>{c.renewal}</td>
                  <td className="text-right">{c.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Refunds */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center text-center justify-between">
            <h2 className="font-semibold text-gray-800">Refunds</h2>
            <div className="flex gap-10 md:gap-20">
              <div>
                <p className="text-xl font-bold text-gray-800">$237</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <p className="text-xs text-gray-400">
                <strong className='text-xl text-blue-600 font-bold'>-43.65%</strong><br />
                Prev 30 days</p>
            </div>
          </div>
          <div className='h-[150px]'>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={refundsData}>
              <CartesianGrid stroke="#f0f2f5" vertical={false} />
              {/* <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} /> */}
              <Tooltip />
              <Bar dataKey="current" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
              <Bar dataKey="previous" fill="url(#patternRed)" barSize={25} />
            </BarChart>
          </ResponsiveContainer>
              </div>
        </div>
      </div>
    </div>
  );
}
