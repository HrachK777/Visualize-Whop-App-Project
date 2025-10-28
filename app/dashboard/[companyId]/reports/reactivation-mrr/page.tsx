'use client';
import { useState, useCallback, useEffect } from 'react';
import MetricChart from '@/components/charts/MetricsChart';
import MetricTable from '@/components/charts/MetricTable';
import { BsFillQuestionCircleFill } from "react-icons/bs";
import CustomerTitle from '@/components/ui/CustomerTitle';
import * as constants from '@/lib/constants';
import Loading from '@/components/ui/loading';
import ErrorComponent from '@/components/ui/error';
import { useFilteredData, useDataColumns, usePivotData, useFilteredPivotData } from '@/lib/hooks/useAnalytics';
import { useAnalyticsData } from '@/lib/hooks/useAnalyticsData';

const filterOptions = constants.mrrFilterOptions;
const mrrCategories = constants.mrrCategories;

export default function ReportsMRRPage() {
  const [view, setView] = useState<'line' | 'bar'>('line');
  const [group, setGroup] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date(),
  });
  const [selectedFilter, setSelectedFilter] = useState('All MRR Movements');
  const allFilterLabel = 'All MRR Movements';

  // ✅ Fetch analytics data using your custom hook
  const { data, loading, error } = useAnalyticsData(group);
  const filteredByDate = useFilteredData(data, dateRange, group);
  const columns = useDataColumns(filteredByDate);
  const pivotData = usePivotData(filteredByDate, mrrCategories);
  const filteredData = useFilteredPivotData(pivotData, selectedFilter, allFilterLabel);
  const [aMonthAgo, setAMonthAgo] = useState(0);
  const [twoMonthsAgo, setTwoMonthsAgo] = useState(0);
  const [threeMonthsAgo, setThreeMonthsAgo] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (data && group == 'month') {
      setAMonthAgo(data[data.length - 2]?.reactivations || 0);
      setTwoMonthsAgo(data[data.length - 3]?.reactivations || 0);
      setThreeMonthsAgo(data[data.length - 4]?.reactivations || 0);
      setCurrentValue(data[data.length - 1]?.reactivations || 0);
    }
  }, [group, data])

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

  if (loading) return <Loading />;

  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-10 py-4 space-y-6">
      {/* Header */}
      <CustomerTitle
        title="Reactivation MRR"
        icon={
          <BsFillQuestionCircleFill
            className="h-5 w-5 text-gray-500 ml-2"
            title='Track MRR from reactivated customers.'
          />
        }
        setDateRange={handleDateRangeChange}
        dateRange={dateRange}
      />

      {filteredByDate.length > 0 ? (
        <>
          <MetricChart
            onGroupingChange={handleGroupChange}
            onViewChange={handleViewChange}
            data={filteredByDate}
            dataKey='reactivations'
            lineColor="#0f2940"
            fillColor="#1677ff"
            type={view}
            currentView={view}
            currentGroup={group}
            aMonthAgo={aMonthAgo}
            twoMonthsAgo={twoMonthsAgo}
            threeMonthsAgo={threeMonthsAgo}
            currentValue={currentValue}
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