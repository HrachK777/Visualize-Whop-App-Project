'use client';

import { Trophy, Users, Settings } from 'lucide-react';

export default function LeadsPage() {
  const topWins = [
    { customer: 'Ethan C Welsh', arr: '$1,440', billing: 'Monthly', country: 'United States' },
    { customer: 'MD SHAHID B EMDAD', arr: '$288', billing: 'Monthly', country: 'United States' },
  ];

  const mrrBreakdown = [
    { label: 'New Business MRR', value: '$144', color: 'text-blue-600' },
    { label: 'Expansion MRR', value: '$648', color: 'text-blue-500' },
    { label: 'Contraction MRR', value: '-$30', color: 'text-red-500' },
    { label: 'Churn MRR', value: '-$180', color: 'text-red-600' },
    { label: 'Reactivation MRR', value: '$0', color: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-6">

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Leads & Trials <Settings className="h-5 w-5 text-gray-400" />
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Leads content */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-gray-800">Leads
              <Settings className="h-5 w-5 text-gray-400" />
            </h2>
            <div className="flex gap-2 text-right">
              <p className="text-2xl font-semibold text-gray-800">0<br />
                <span className="text-gray-400">Last 30 days:</span>
              </p>
              <p className="text-xs text-blue-600 font-semibold">-<br />
                <span className="text-gray-400">Past 30 days:</span> </p>
            </div>
          </div>
          <div className="flex-1 flex">
            {/* <div className="h-32 w-full bg-gradient-to-t from-blue-100 to-transparent rounded-b-md flex items-end"> */}
            {/* <div className="h-[80%] w-[90%] mx-auto bg-blue-400 rounded-t-md"></div> */}
          </div>
        </div>

        {/* Trial-to-paid-cohorts */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-gray-800">Trial-to-paid-cohorts</h2>
          </div>
          <div className="flex-1 flex">
            {/* <div className="h-32 w-full bg-gradient-to-t from-blue-100 to-transparent rounded-b-md flex items-end"> */}
            {/* <div className="h-[80%] w-[90%] mx-auto bg-blue-400 rounded-t-md"></div> */}
          </div>
        </div>
        {/* Free Trials */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-gray-800">Free Trials
              <Settings className="h-5 w-5 text-gray-400" />
            </h2>
            <div className="flex gap-2 text-right">
              <p className="text-2xl font-semibold text-gray-800">0<br />
                <span className="text-gray-400">Last 30 days:</span>
              </p>
              <p className="text-xs text-blue-600 font-semibold">-<br />
                <span className="text-gray-400">Past 30 days:</span> </p>
            </div>
          </div>
          <div className="flex-1 flex">
            {/* <div className="h-32 w-full bg-gradient-to-t from-blue-100 to-transparent rounded-b-md flex items-end"> */}
            {/* <div className="h-[80%] w-[90%] mx-auto bg-blue-400 rounded-t-md"></div> */}
          </div>
        </div>

        {/* Average Sales Cycle Length */}
        <div className="bg-white rounded-lg shadow-sm p-5 h-[300px] flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-gray-800">Average Sales Cycle Length
              <Settings className="h-5 w-5 text-gray-400" />
            </h2>
            <div className="flex gap-2 text-right">
              <p className="text-2xl font-semibold text-gray-800">0<br />
                <span className="text-gray-400">Last 30 days:</span>
              </p>
              <p className="text-xs text-blue-600 font-semibold">-<br />
                <span className="text-gray-400">Past 30 days:</span> </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
