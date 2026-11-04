export type EarningsPeriod = 'today' | 'week' | 'month' | 'lastMonth' | 'year';

/** Trend chart bucket size: day, week or month. */
export type Granularity = 'D' | 'W' | 'M';

export interface PeriodRange {
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
}

export interface TrendPoint {
  label: string;
  earningMinor: number;
  commissionMinor: number;
}
