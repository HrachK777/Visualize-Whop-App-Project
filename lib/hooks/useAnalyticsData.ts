import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

export function useAnalyticsData(group: string, referenceItem?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchUrl;

        if (group == "month") {
          fetchUrl = `/api/analytics/cached?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}&period=${group}&range=12`;
        }
        else if (group == "day") {
          fetchUrl = `/api/analytics/cached?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}&period=${group}&range=30`;
        } else {
          fetchUrl = `/api/analytics/cached?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}&period=${group}`;
        }

        console.log('for debug fetchUrl = ', fetchUrl);
        const res = await fetch(
          `/api/analytics/cached?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}&period=${group}&range=12`,
          { signal: abortController.signal }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('for debug result.historical = ', result.historical);

        if (!isMounted) return;

        if (result.historical?.length > 0) {
          if (referenceItem) {
            const addedData = result.historical.map((item: any) => {
              switch (referenceItem) {
                case 'netNewMRR':
                  return {
                    ...item,
                    netNewMRR: (item.newMRR + item.expansionMRR + item.reactivations) - (item.contractionMRR + item.churnedMRR)
                  };
                case 'LTV':
                  return {
                    ...item,
                    ltv: item.customerChurnRate == 0 ? 0 : item.arpu / item.customerChurnRate
                  };
                  // Add your logic here
                  break;
                default:
                  break;
              }
            });
            if (group === 'month') {
              const formatted = addedData.map((item: any) => ({
                ...item,
                date: formatDate(item.date),
              }));
              setData(formatted);
            } else {
              setData(addedData);
            }
          }
          else {
            if (group === 'month') {
              const formatted = result.historical.map((item: any) => ({
                ...item,
                date: formatDate(item.date),
              }));
              setData(formatted);
            }
            else {
              setData(result.historical);
            }
          }
        } else {
          setData([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Failed to load analytics');
          setData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [group]);

  return { data, loading, error };
}
