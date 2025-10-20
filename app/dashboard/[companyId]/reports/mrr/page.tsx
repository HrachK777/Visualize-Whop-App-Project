'use client';
import { useState, useEffect } from 'react';
import MetricChart from '@/components/charts/MetricsChart';
import MetricTable, { MetricPivotData } from '@/components/charts/MetricTable';
import DateRangePicker from '@/components/charts/DateRangePicker';

// simulate pre-aggregated data fetch
function generateMockData(group: string, start: string, end: string) {
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

export default function ReportsPage() {
  const [view, setView] = useState<'line' | 'bar'>('line');
  const [group, setGroup] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [range, setRange] = useState({ start: '2024-10-01', end: '2025-10-01' });
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All MRR Movements');

  // Filter the data reactively
  const filteredData =
    selectedFilter === 'All MRR Movements'
      ? pivotData
      : pivotData.filter((d) => d.category === selectedFilter);


  useEffect(() => {
    // fetch or compute data based on group/range
    setData(generateMockData(group, range.start, range.end));
  }, [group, range]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Monthly Recurring Revenue</h2>
        <DateRangePicker onRangeChange={setRange} currentRange={range} />
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
