import { useCallback, useMemo, useState } from 'react';

import { useGetMyBusinessesQuery, useGetMyEarningsQuery } from '@/redux/api/business/businessApi';

import { buildTrend, defaultGranularity, periodRange } from './helpers';
import { EarningsPeriod, Granularity } from './types';

/**
 * Same `getMyEarnings` call as before (from/to local dates + optional
 * businessId), with mockup periods. A second call for the equal-length window
 * right before the selected one (same business filter) drives the "You earn"
 * % change. The trend chart is bucketed client-side from `transactions`.
 */
export function useEarningsScreen() {
  const [period, setPeriodState] = useState<EarningsPeriod>('month');
  const [granularity, setGranularity] = useState<Granularity>(defaultGranularity('month'));
  const [businessId, setBusinessId] = useState<string>('');
  const [pulling, setPulling] = useState(false);

  const { data: businesses = [], refetch: refetchBusinesses } = useGetMyBusinessesQuery();
  const range = useMemo(() => periodRange(period), [period]);

  const {
    data: earnings,
    isLoading,
    isError,
    refetch,
  } = useGetMyEarningsQuery({
    from: range.from,
    to: range.to,
    businessId: businessId || undefined,
  });

  const { data: previous, refetch: refetchPrevious } = useGetMyEarningsQuery({
    from: range.prevFrom,
    to: range.prevTo,
    businessId: businessId || undefined,
  });

  const setPeriod = useCallback((p: EarningsPeriod) => {
    setPeriodState(p);
    setGranularity(defaultGranularity(p));
  }, []);

  const refresh = useCallback(async () => {
    setPulling(true);
    try {
      await Promise.all([refetch(), refetchPrevious(), refetchBusinesses()]);
    } finally {
      setPulling(false);
    }
  }, [refetch, refetchPrevious, refetchBusinesses]);

  // % change in "You earn" vs. the previous equal-length period; null hides it.
  const earnTrendPct = useMemo(() => {
    if (!earnings || !previous || previous.summary.netMinor === 0) {
      return null;
    }
    const prev = previous.summary.netMinor;
    return ((earnings.summary.netMinor - prev) / Math.abs(prev)) * 100;
  }, [earnings, previous]);

  const trend = useMemo(
    () => buildTrend(earnings?.transactions ?? [], range, granularity),
    [earnings, range, granularity],
  );

  const photoById = useMemo(() => {
    const map = new Map<string, string | undefined>();
    businesses.forEach((b) => map.set(b.id, b.images?.[0]));
    return map;
  }, [businesses]);

  const selectedBusinessName = businesses.find((b) => b.id === businessId)?.businessName;

  return {
    period,
    setPeriod,
    granularity,
    setGranularity,
    businesses,
    businessId,
    setBusinessId,
    selectedBusinessName,
    photoById,
    earnings,
    isLoading,
    isError,
    earnTrendPct,
    trend,
    refreshing: pulling,
    refresh,
  };
}
