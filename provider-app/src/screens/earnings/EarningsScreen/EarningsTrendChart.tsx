import React from 'react';

import { SECONDARY_ORANGE, SERIES_BLUE, SmoothTrendChart } from '@/components/SmoothTrendChart';

import { TrendPoint } from './types';

export const EARN_BLUE = SERIES_BLUE;
export const COMMISSION_ORANGE = SECONDARY_ORANGE;

/** Earnings trend card chart: "You earn" area + dashed commission line. */
export function EarningsTrendChart({ points }: { points: TrendPoint[] }) {
  return (
    <SmoothTrendChart
      points={points.map((p) => ({ label: p.label, value: p.earningMinor, secondary: p.commissionMinor }))}
      seriesLabel="You earn"
      secondaryLabel="Commission"
      showSecondary
      emptyText="No completed sales in this period yet."
    />
  );
}
