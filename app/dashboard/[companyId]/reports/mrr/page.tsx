'use client';
import { useState, useEffect } from 'react';
import MetricChart from '@/components/charts/MetricsChart';
import MetricTable, { MetricPivotData } from '@/components/charts/MetricTable';
import DateRangePicker from '@/components/charts/DateRangePicker';
import { BiSolidSave } from "react-icons/bi";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { CgSortAz } from "react-icons/cg";

// simulate pre-aggregated data fetch
function generateMockData(group: string, start: Date, end: Date) {
  const points = [];
  const base = new Date(start);
  for (let i = 0; i < 10; i++) {
    const label =
      group === 'month'
        ? base.toLocaleString('default', { month: 'short', year: 'numeric' })
        : base.toISOString().split('T')[0];
    points.push({ date: label, value: Math.floor(Math.random() * 8000) });
    base.setDate(base.getDate() + (group === 'month' ? 30 : 7));
  }
  return points;
}

const filterOptions = [
  'All MRR Movements',
  'New Business MRR',
  'Expansion MRR',
  'Churn MRR',
  'Reactivation MRR',
  'Contraction MRR',
];

// interface MetricPivotData {
//   category: string;
//   values: Record<string, number>;
// }

const columns = [
  'Jan 2025',
  'Feb 2025',
  'Mar 2025',
  'Apr 2025',
  'May 2025',
  'Jun 2025',
  'Jul 2025',
  'Aug 2025',
];

const pivotData: MetricPivotData[] = [
  {
    category: 'New Business MRR',
    values: { 'Jul 2025': 2000, 'Aug 2025': 2500 },
  },
  {
    category: 'Expansion MRR',
    values: { 'Jun 2025': 1500, 'Jul 2025': 2000, 'Aug 2025': 2200 },
  },
  {
    category: 'Churn MRR',
    values: { 'Aug 2025': -800 },
  },
  {
    category: 'Reactivation MRR',
    values: { 'Aug 2025': 400 },
  },
  {
    category: 'Contraction MRR',
    values: { 'Aug 2025': -300 },
  },
];

export default function ReportsMRRPage() {
  const [view, setView] = useState<'line' | 'bar'>('line');
  const [group, setGroup] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date('2024-10-17'),
    end: new Date('2025-10-16'),
  });
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All MRR Movements');

  // Filter the data reactively
  const filteredData =
    selectedFilter === 'All MRR Movements'
      ? pivotData
      : pivotData.filter((d) => d.category === selectedFilter);


  useEffect(() => {
    // fetch or compute data based on group/range
    setData(generateMockData(group, dateRange.start, dateRange.end));
  }, [group, dateRange]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-10 py-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex text-2xl font-semibold text-gray-800 text-center items-center">Monthly Recurring Revenue
          <BsFillQuestionCircleFill className="h-5 w-5 text-gray-500 ml-2" title='The predictable revenue your business earns each month from subscriptions based on what customers are currently committed to paying you monthly.' />
        </h2>
        <div className='flex gap-6 items-center'>
          <div className="grid grid-cols-2 items-center m-3 border border-gray-200 rounded-md divide-x-2 divide-gray-200 bg-white">
            <button className='hover:bg-gray-100 cursor-pointer'>
              <CgSortAz className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
            </button>
            <button className='hover:bg-gray-100 cursor-pointer'>
              <BiSolidSave className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
            </button>
          </div>
          <DateRangePicker onChange={setDateRange} range={dateRange} />
        </div>
      </div>

      <MetricChart
        onGroupingChange={setGroup}
        onViewChange={setView}
        data={data}
        lineColor="#0f2940"
        fillColor="#1677ff"
        type={view}
        currentView={view}
        currentGroup={group}
      />

      <MetricTable
        title="Chart Data"
        columns={columns}
        data={filteredData}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter} />
    </div>
  );
}
