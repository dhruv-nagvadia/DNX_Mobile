import { Reminder } from '@/redux/api/reminder/types';

const DAY = 86_400_000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Whole days from today to the reminder's due date (negative = overdue). */
export function daysUntil(iso: string): number {
  return Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(new Date()).getTime()) / DAY);
}

/** "15 Nov" — short date for the due line (year only when it isn't this year). */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export type DueTone = 'overdue' | 'today' | 'upcoming';

/** Due-line text + tone for a PENDING reminder, matching the mockup wording. */
export function dueLine(r: Reminder): { text: string; tone: DueTone } {
  const days = daysUntil(r.dueDate);
  const date = shortDate(r.dueDate);
  if (days < 0) {
    const n = -days;
    return { text: `Overdue by ${n} day${n === 1 ? '' : 's'} • ${date}`, tone: 'overdue' };
  }
  if (days === 0) {
    return { text: 'Due today', tone: 'today' };
  }
  if (days === 1) {
    return { text: `Tomorrow • ${date}`, tone: 'upcoming' };
  }
  if (days <= 45) {
    return { text: `In ${days} days • ${date}`, tone: 'upcoming' };
  }
  return { text: date, tone: 'upcoming' };
}

/** History rows collapse by default once there are more than this many. */
export const HISTORY_COLLAPSE_AFTER = 3;
