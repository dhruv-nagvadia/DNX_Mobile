// Ports `frontend/src/utils/dateRange.ts` 1:1 — the Earnings screen's 5-preset
// date-range tabs.
export type RangePreset = 'today' | '7d' | '30d' | 'month' | 'all';

export const RANGE_PRESETS: { id: RangePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'month', label: 'This month' },
  { id: 'all', label: 'All time' },
];

/** Local "YYYY-MM-DD" — avoids the UTC-shift bug of toISOString(). */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function rangeFor(preset: RangePreset): { from?: string; to?: string } {
  const today = new Date();
  const to = ymd(today);

  if (preset === 'all') return {};
  if (preset === 'today') return { from: to, to };

  if (preset === '7d' || preset === '30d') {
    const from = new Date(today);
    from.setDate(from.getDate() - (preset === '7d' ? 6 : 29));
    return { from: ymd(from), to };
  }

  // month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: ymd(monthStart), to };
}
