import { DollarSign, Users, TrendingUp, Activity, Settings, Trophy, ChevronDown, MoveDown, MoveDownIcon, SortAscIcon, SortDescIcon, PlusIcon, TreeDeciduousIcon } from 'lucide-react'
import { MetricsChart } from '@/components/charts/MetricsChart'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from 'recharts';
import ARRLineChart from '../charts/ARRLineChart';
import NetMRRMovementsChart from '../charts/NetMRRMovementsChart';

export default function Home() {
  const topWins = [
    { customer: 'Ethan C Welsh', arr: '$1,440', billing: 'Monthly', country: 'United States' },
    { customer: 'MD SHAHID B EMDAD', arr: '$288', billing: 'Monthly', country: 'United States' },
  ];

  const mrrBreakdown = [
    { label: 'New Business MRR', value: '$144', color: 'text-blue-600', count: 2 },
    { label: 'Expansion MRR', value: '$648', color: 'text-blue-500', count: 6 },
    { label: 'Contraction MRR', value: '-$30', color: 'text-red-500', count: 1 },
    { label: 'Churn MRR', value: '-$180', color: 'text-red-600', count: 2 },
    { label: 'Reactivation MRR', value: '$0', color: 'text-gray-500', count: 0 },
  ];

  

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
  //         <p className="font-semibold mb-2">{label}</p>
  //         {payload.map((entry) => (
  //           <p key={entry.name} className="text-gray-700">
  //             <span
  //               className="inline-block w-3 h-3 mr-2 rounded-full"
  //               style={{ backgroundColor: entry.color }}
  //             ></span>
  //             {entry.name}: ${entry.value}
  //           </p>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-center justify-between my-5">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Home <Settings className="h-5 w-5 text-gray-400" />
        </h1>
        <div className="grid grid-cols-2 items-center m-3 border border-gray-200 rounded-md divide-x-2 divide-gray-200 bg-white">
          <button className='hover:bg-gray-100 cursor-pointer'>
            <SortDescIcon className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
          <button className='hover:bg-gray-100 cursor-pointer'>
            <PlusIcon className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Top Wins */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <Trophy className="text-yellow-500 h-5 w-5" />
              Top wins from this week
            </div>
            <button className="text-xs font-medium text-gray-600 border border-gray-200 px-2 py-1 rounded-md">
              2 CUSTOMERS
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Customer</th>
                <th className="py-2">
                  ARR
                  <SortDescIcon className="inline-block ml-1 w-3 h-3" />
                </th>
                <th className="py-2">Billing Cycle</th>
                <th className="py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {topWins.map((win, i) => (
                <tr key={i} className="text-gray-700">
                  <td className="py-2">{win.customer}</td>
                  <td className="py-2">{win.arr}</td>
                  <td className="py-2">{win.billing}</td>
                  <td className="py-2">{win.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right MRR Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">MRR Breakdown</h2>
            <select
              className="text-sm border border-gray-200 text-gray-600 rounded-md px-1 py-1"
              defaultValue="this_month"
              aria-label="Select time range"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
            </select>
          </div>

          <div className="space-y-4 text-sm">
            {mrrBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between px-4">
                <div className='flex gap-10'>
                  <span className={item.color}>{item.count}</span>
                  <span>{item.label}</span>
                </div>
                <span className="font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between font-semibold text-gray-800 px-4">
              <div className='gap-10'>
                <span>Net MRR Movement</span>
              </div>
              <span>$582</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-gray-600 px-4">
              <div className='flex gap-10'>
                <span>3</span>
                <span>Scheduled MRR Movements</span>
              </div>
              <span>-$132</span>
            </div>
          </div>
        </div>

        {/* Bottom Left - Net MRR Movements */}
          <NetMRRMovementsChart />

        {/* Bottom Right - Annual Run Rate */}
            <ARRLineChart />
      </div>
    </div>
  )
}