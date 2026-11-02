import { useMemo, useState } from 'react';

import { useGetBusinessBookingsQuery, useGetMyOrdersQuery } from '@/redux/api/business/businessApi';
import { TrendPoint } from '@/components/TrendChart';

import { EarningsPeriod } from './types';

const dayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'short' });
const rangeFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const DAY_MS = 24 * 60 * 60 * 1000;

/** The trend compares the last point with the one before it. */
const COMPARE_LABEL: Record<EarningsPeriod, string> = {
  week: 'vs. previous day',
  month: 'vs. previous week',
  year: 'vs. previous month',
};

interface Bucket {
  label: string;
  start: number;
  end: number;
}

function bucketsFor(period: EarningsPeriod): Bucket[] {
  const now = new Date();

  if (period === 'week') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getTime() - (6 - i) * DAY_MS);
      d.setHours(0, 0, 0, 0);
      return { label: dayFmt.format(d), start: d.getTime(), end: d.getTime() + DAY_MS };
    });
  }

  if (period === 'month') {
    return Array.from({ length: 4 }, (_, i) => {
      const end = new Date(now);
      end.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - (3 - i) * 7 + 1);
      const start = new Date(end.getTime() - 7 * DAY_MS);
      return { label: `Wk ${i + 1}`, start: start.getTime(), end: end.getTime() };
    });
  }

  // year — 12 calendar months ending this month.
  return Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const start = monthDate.getTime();
    const end = new Date(now.getFullYear(), now.getMonth() - (11 - i) + 1, 1).getTime();
    return { label: monthFmt.format(monthDate), start, end };
  });
}

/** Ports `frontend/src/components/EarningsPanel/useEarnings.ts`'s week/month/
 * year bucketing — built client-side from bookings/orders already fetched
 * elsewhere, no separate chart endpoint needed. */
export function useEarningsPanel(businessId: string, isStore: boolean) {
  const [period, setPeriod] = useState<EarningsPeriod>('week');

  const bookingsQuery = useGetBusinessBookingsQuery(businessId, { skip: isStore });
  const ordersQuery = useGetMyOrdersQuery(undefined, { skip: !isStore });

  const { points, total, trendPct, currency, isEmpty, rangeLabel } = useMemo(() => {
    const buckets = bucketsFor(period);
    const values = new Array(buckets.length).fill(0);
    let cur = 'INR';
    let any = false;

    if (isStore) {
      for (const o of ordersQuery.data ?? []) {
        if (o.provider.id !== businessId || o.status === 'CANCELLED') {
          continue;
        }
        const t = new Date(o.createdAt).getTime();
        const idx = buckets.findIndex((b) => t >= b.start && t < b.end);
        if (idx >= 0) {
          values[idx] += o.amountMinor / 100;
          cur = o.currency;
          any = true;
        }
      }
    } else {
      for (const b of bookingsQuery.data ?? []) {
        if (b.status === 'CANCELLED') {
          continue;
        }
        const t = new Date(b.startTime).getTime();
        const idx = buckets.findIndex((bk) => t >= bk.start && t < bk.end);
        if (idx >= 0) {
          values[idx] += b.amountMinor / 100;
          cur = b.currency;
          any = true;
        }
      }
    }

    const pts: TrendPoint[] = buckets.map((b, i) => ({ label: b.label, value: Math.round(values[i]) }));
    const sumTotal = values.reduce((sum, v) => sum + v, 0);
    const prev = values[values.length - 2] ?? 0;
    const last = values[values.length - 1] ?? 0;
    const pct = prev > 0 ? ((last - prev) / prev) * 100 : null;
    const range = `${rangeFmt.format(new Date(buckets[0].start))} – ${rangeFmt.format(new Date())}`;

    return {
      points: pts,
      total: Math.round(sumTotal),
      trendPct: pct,
      currency: cur,
      isEmpty: !any,
      rangeLabel: range,
    };
  }, [period, isStore, businessId, bookingsQuery.data, ordersQuery.data]);

  return {
    period,
    setPeriod,
    points,
    total,
    trendPct,
    currency,
    isEmpty,
    rangeLabel,
    compareLabel: COMPARE_LABEL[period],
    isLoading: isStore ? ordersQuery.isLoading : bookingsQuery.isLoading,
  };
}
