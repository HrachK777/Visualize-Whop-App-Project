'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import MetricChart from '@/components/charts/MetricsChart';
import MetricTable, { MetricPivotData } from '@/components/charts/MetricTable';
import { BsFillQuestionCircleFill } from "react-icons/bs";
import CustomerTitle from '@/components/ui/CustomerTitle';

const filterOptions = [
  'All MRR Movements',
  'New Business MRR',
  'Expansion MRR',
  'Churn MRR',
  'Reactivation MRR',
  'Contraction MRR',
];

const mrrCategories = [
  { key: 'newMRR', label: 'New Business MRR' },
  { key: 'expansionMRR', label: 'Expansion MRR' },
  { key: 'churnedMRR', label: 'Churn MRR' },
  { key: 'reactivations', label: 'Reactivation MRR' },
  { key: 'contractionMRR', label: 'Contraction MRR' },
] as const;

// Memoized date formatter
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("default", {
    month: "short",
    year: "numeric"
  });
};

export default function ReportsMRRPage() {
  const [view, setView] = useState<'line' | 'bar'>('line');
  const [group, setGroup] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date('2024-10-17'),
    end: new Date('2025-10-16'),
  });
  const [data, setData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All MRR Movements');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter data by date range (memoized)
  const filteredByDate = useMemo(() => {
    if (!data.length) return [];
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.originalDate || item.date);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });
  }, [data, dateRange]);

  // Memoized columns computation
  const columns = useMemo(() => {
    if (!filteredByDate.length) return [];
    const uniqueDates = Array.from(new Set(filteredByDate.map(d => d.date)));
    return [...uniqueDates];
  }, [filteredByDate]);

  // Memoized pivot data computation
  const pivotData = useMemo(() => {
    if (!filteredByDate.length) return [];
    
    return mrrCategories.map(cat => {
      const row: any = { category: cat.label, values: {} };
      
      filteredByDate.forEach((item: any) => {
        const value = item[cat.key] ?? 0;
        row.values[item.date] = value;
      });
      
      return row;
    });
  }, [filteredByDate]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return selectedFilter === 'All MRR Movements'
      ? pivotData
      : pivotData.filter((d: any) => d.category === selectedFilter);
  }, [selectedFilter, pivotData]);

  // Fetch analytics data
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/analytics/cached?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}&period=${group}`,
          { signal: abortController.signal }
        );

        if (!res.ok) {
          console.log("HTTP error", res);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!isMounted) return;

        if (result.historical?.length > 0) {
          if (group == "month") {

            // Format data once
            const formatted = result.historical.map((item: any) => ({
              ...item,
              date: formatDate(item.date)
            }));
            setData(formatted);
          } else {
            setData(result.historical);
          }
        } else {
          setData([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;

        console.error('Error fetching analytics:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load analytics');
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [group]);

  // Memoized callbacks
  const handleGroupChange = useCallback((newGroup: typeof group) => {
    setGroup(newGroup);
  }, []);

  const handleViewChange = useCallback((newView: typeof view) => {
    setView(newView);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const handleDateRangeChange = useCallback((range: { start: Date; end: Date }) => {
    setDateRange(range);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-800 font-semibold">Error loading analytics</p>
          <p className="text-gray-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-10 py-4 space-y-6">
      {/* Header */}
      <CustomerTitle
        title="Monthly Recurring Revenue"
        icon={
          <BsFillQuestionCircleFill
            className="h-5 w-5 text-gray-500 ml-2"
            title='The predictable revenue your business earns each month from subscriptions based on what customers are currently committed to paying you monthly.'
          />
        }
        setDateRange={handleDateRangeChange}
        dateRange={dateRange}
      />

      {data.length > 0 ? (
        <>
              <MetricChart
                onGroupingChange={handleGroupChange}
                onViewChange={handleViewChange}
                data={data}
                dataKey='mrr'
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
                onFilterChange={handleFilterChange}
              />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          {data.length > 0 
            ? 'No data available for the selected date range' 
            : 'No data available for the selected period'}
        </div>
      )
      }
    </div >
  );
}