import {
  Activity,
  Bell,
  CalendarClock,
  Car,
  FileText,
  Home,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react-native';

import { ReminderRepeat, ReminderType } from '@/redux/api/reminder/types';

export const TYPE_ICON: Record<ReminderType, LucideIcon> = {
  vehicle: Car,
  insurance: ShieldCheck,
  health: Activity,
  document: FileText,
  home: Home,
  appointment: CalendarClock,
  other: Bell,
};

export const TYPE_LABEL: Record<ReminderType, string> = {
  vehicle: 'Vehicle',
  insurance: 'Insurance',
  health: 'Health',
  document: 'Document',
  home: 'Home',
  appointment: 'Appointment',
  other: 'Other',
};

export const TYPE_OPTIONS: ReminderType[] = [
  'vehicle',
  'insurance',
  'health',
  'document',
  'home',
  'appointment',
  'other',
];

/** Plain date, no "Due today"/"Overdue"/"In N days" framing — for History rows, where the outcome is already settled and that framing no longer applies. */
export function formatReminderDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Human due-date label, whether it's overdue, and whether it's actionable
 * yet (due today or already overdue) — a reminder due in the future can't be
 * marked Done/Missed ahead of time. Each reminder row is its own individual
 * occurrence (responding to a repeating one spawns a separate row for next
 * time), so there's no "first vs next" ambiguity to label around anymore.
 */
export function dueLabel(iso: string): { text: string; overdue: boolean; actionable: boolean } {
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  const actionable = days <= 0;
  const dateStr = new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (days < 0) return { text: `Overdue · ${dateStr}`, overdue: true, actionable };
  if (days === 0) return { text: `Due today · ${dateStr}`, overdue: false, actionable };
  if (days === 1) return { text: `Tomorrow · ${dateStr}`, overdue: false, actionable };
  if (days <= 45) return { text: `In ${days} days · ${dateStr}`, overdue: false, actionable };
  return { text: dateStr, overdue: false, actionable };
}

export const REPEAT_LABEL: Record<string, string> = {
  NONE: 'One-time',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

/**
 * Whether `date` is actually a date this repeat cycle would land on, counting
 * forward from `start` — e.g. weekly only lands every 7th day, monthly only
 * on the same day-of-month, yearly only on the same day+month. Used to grey
 * out the end-date picker so a provider can only pick a real "stop after"
 * occurrence, not an arbitrary date the reminder would never actually hit.
 */
export function isReminderOccurrence(date: Date, start: Date, repeat: ReminderRepeat): boolean {
  if (repeat === 'NONE' || repeat === 'DAILY') return true;
  if (repeat === 'WEEKLY') {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    const diffDays = Math.round((d.getTime() - s.getTime()) / 86_400_000);
    return diffDays >= 0 && diffDays % 7 === 0;
  }
  if (repeat === 'MONTHLY') return date.getDate() === start.getDate();
  if (repeat === 'YEARLY') {
    return date.getDate() === start.getDate() && date.getMonth() === start.getMonth();
  }
  return true;
}
