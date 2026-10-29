import { useMemo, useState } from 'react';

import { useGetMyBusinessesQuery, useGetMyEarningsQuery } from '@/redux/api/business/businessApi';
import { RangePreset, rangeFor } from '@/utils/dateRange';

/** Ports `frontend/src/pages/provider/EarningsPage/useEarningsPage.ts` 1:1 —
 * same 5-preset date range, same optional per-business filter, same
 * `getMyEarnings` call. No trend chart (the web page doesn't have one either
 * — that lives in a separate per-business panel, out of scope for parity). */
export function useEarningsScreen() {
  const [preset, setPreset] = useState<RangePreset>('30d');
  const [businessId, setBusinessId] = useState<string>('');

  const { data: businesses = [] } = useGetMyBusinessesQuery();
  const range = useMemo(() => rangeFor(preset), [preset]);

  const { data: earnings, isLoading, isFetching, refetch } = useGetMyEarningsQuery({
    from: range.from,
    to: range.to,
    businessId: businessId || undefined,
  });

  return {
    preset,
    setPreset,
    businesses,
    businessId,
    setBusinessId,
    earnings,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
  };
}
