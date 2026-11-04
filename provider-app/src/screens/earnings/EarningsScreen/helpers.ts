import { EarningsTransaction } from '@/redux/api/business/types';

import { EarningsPeriod, Granularity, PeriodRange, TrendPoint } from './types';

export const PERIODS: { id: EarningsPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'lastMonth', label: 'Last month' },
  { id: 'year', label: 'This year' },
];

/** Local "YYYY-MM-DD" — avoids the UTC-shift bug of toISOString(). */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "YYYY-MM-DD" → local midnight. */
function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** Monday of the week `d` falls in (local time). */
function weekStart(d: Date): Date {
  const day = d.getDay(); // 0 = Sunday
  return addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), day === 0 ? -6 : 1 - day);
}


/**
 * The selected period's inclusive local-date range, plus the equal-length
 * window right before it (for the "You earn" % change). Current periods end
 * today; "Last month" is the whole previous calendar month.
 */
export function periodRange(period: EarningsPeriod, now = new Date()): PeriodRange {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let from = today;
  let to = today;

  if (period === 'week') {
    from = weekStart(today);
  } else if (period === 'month') {
    from = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (period === 'lastMonth') {
    from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    to = new Date(today.getFullYear(), today.getMonth(), 0);
  } else if (period === 'year') {
    from = new Date(today.getFullYear(), 0, 1);
  }

  // The comparison period is the SAME stretch one period back (matches the web
  // Earnings page): this month so far (Nov 1–5) vs Oct 1–5, this week vs the
  // same days last week, this year vs the same span last year, today vs
  // yesterday, last month vs the month before it.
  let prevFrom: Date;
  let prevTo: Date;
  if (period === 'week') {
    prevFrom = addDays(from, -7);
    prevTo = addDays(to, -7);
  } else if (period === 'month') {
    prevFrom = new Date(from.getFullYear(), from.getMonth() - 1, 1);
    const lastDayPrev = new Date(from.getFullYear(), from.getMonth(), 0).getDate();
    prevTo = new Date(prevFrom.getFullYear(), prevFrom.getMonth(), Math.min(to.getDate(), lastDayPrev));
  } else if (period === 'lastMonth') {
    prevFrom = new Date(from.getFullYear(), from.getMonth() - 1, 1);
    prevTo = new Date(from.getFullYear(), from.getMonth(), 0);
  } else if (period === 'year') {
    prevFrom = new Date(from.getFullYear() - 1, 0, 1);
    // Clamp 29 Feb → 28 Feb in a non-leap previous year.
    const lastDayThatMonth = new Date(to.getFullYear() - 1, to.getMonth() + 1, 0).getDate();
    prevTo = new Date(to.getFullYear() - 1, to.getMonth(), Math.min(to.getDate(), lastDayThatMonth));
  } else {
    prevFrom = addDays(from, -1);
    prevTo = addDays(to, -1);
  }

  return { from: ymd(from), to: ymd(to), prevFrom: ymd(prevFrom), prevTo: ymd(prevTo) };
}

/** The chart's default bucket size for a period. */
export function defaultGranularity(period: EarningsPeriod): Granularity {
  return period === 'year' ? 'M' : 'D';
}

const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });

/** "Nov 30" */
export function shortDate(iso: string | Date): string {
  return dayFmt.format(typeof iso === 'string' ? new Date(iso) : iso);
}

function bucketKey(d: Date, g: Granularity): string {
  if (g === 'M') {
    return `${d.getFullYear()}-${d.getMonth()}`;
  }
  if (g === 'W') {
    return ymd(weekStart(d));
  }
  return ymd(d);
}

/**
 * Earnings + commission per day/week/month across the WHOLE selected range,
 * zero-filled, from the completed transactions' `settledAt`.
 */
export function buildTrend(
  transactions: EarningsTransaction[],
  range: { from: string; to: string },
  g: Granularity,
): TrendPoint[] {
  const from = parseYmd(range.from);
  const to = parseYmd(range.to);
  const points: TrendPoint[] = [];
  const index = new Map<string, number>();

  let cursor = g === 'M' ? new Date(from.getFullYear(), from.getMonth(), 1) : g === 'W' ? weekStart(from) : from;
  while (cursor.getTime() <= to.getTime()) {
    // Label a bucket by the first day of it that is inside the range.
    const labelDate = cursor.getTime() < from.getTime() ? from : cursor;
    index.set(bucketKey(cursor, g), points.length);
    points.push({
      label: g === 'M' ? monthFmt.format(labelDate) : dayFmt.format(labelDate),
      earningMinor: 0,
      commissionMinor: 0,
    });
    cursor =
      g === 'M'
        ? new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
        : addDays(cursor, g === 'W' ? 7 : 1);
  }

  for (const t of transactions) {
    if (!t.settledAt) {
      continue;
    }
    const i = index.get(bucketKey(new Date(t.settledAt), g));
    if (i === undefined) {
      continue;
    }
    points[i].earningMinor += t.earningMinor;
    points[i].commissionMinor += t.commissionMinor;
  }
  return points;
}

/** "Online" / "Cash" / "Online + cash" from how a sale was actually paid. */
export function paidVia(t: EarningsTransaction): string {
  if (t.onlineMinor > 0 && t.cashMinor > 0) {
    return 'Online + cash';
  }
  if (t.onlineMinor > 0) {
    return 'Online';
  }
  if (t.cashMinor > 0) {
    return 'Cash';
  }
  return t.paymentMethod === 'CASH' ? 'Cash' : 'Online';
}

/** 1000 bps → "10%", 850 → "8.5%". */
export function ratePct(bps: number): string {
  return `${Number((bps / 100).toFixed(2))}%`;
}
