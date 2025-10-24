// hooks/useFilteredData.ts
import { useMemo } from 'react';

interface DateRange {
  start: Date;
  end: Date;
}

export interface DataItem {
  date: string;
  originalDate?: string;
  [key: string]: any;
}

export interface PivotCategory {
  key: string;
  label: string;
}

export interface PivotData {
  category: string;
  values: Record<string, string | number>;
}

type GroupType = 'day' | 'week' | 'month' | 'quarter' | 'year';

// Helper function to get year-month string
const ym = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export function useFilteredData<T extends { date: string; originalDate?: string }>(
  data: T[],
  dateRange: DateRange,
  group: GroupType
): T[] {
  return useMemo(() => {
    if (!data.length) return [];

    return data.filter((item) => {
      if (group === 'quarter') return true;
      
      const itemDate = new Date(item.originalDate || item.date);
      const itemYM = ym(itemDate);
      const startYM = ym(dateRange.start);
      const endYM = ym(dateRange.end);

      return itemYM >= startYM && itemYM <= endYM;
    });
  }, [data, dateRange, group]);
}

/**
 * Hook: Get unique columns from data
 */
export function useDataColumns(data: DataItem[]): string[] {
  return useMemo(() => {
    if (!data.length) return [];

    const uniqueDates = Array.from(new Set(data.map(d => d.date)));
    return uniqueDates;
  }, [data]);
}

/**
 * Hook: Transform data to pivot table format
 */
export function usePivotData(
  data: DataItem[],
  categories: PivotCategory[],
): PivotData[] {
  return useMemo(() => {
    if (!data.length) return [];
    
    return categories.map(cat => {
      const row: PivotData = { category: cat.label, values: {} };
      
      data.forEach((item) => {
        const value = item[cat.key] ?? 0;
        row.values[item.date] = value;
      });
      
      return row;
    });
  }, [data, categories]);
}

/**
 * Hook: Filter pivot data by selected category
 */
export function useFilteredPivotData(
  pivotData: PivotData[],
  selectedFilter: string,
  allFilterLabel: string = 'All MRR Movements'
): PivotData[] {
  return useMemo(() => {
    return selectedFilter === allFilterLabel
      ? pivotData
      : pivotData.filter((d) => d.category === selectedFilter);
  }, [selectedFilter, pivotData, allFilterLabel]);
}