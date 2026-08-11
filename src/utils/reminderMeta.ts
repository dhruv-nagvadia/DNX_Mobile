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

import { ReminderType } from '@/redux/api/reminder/types';

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

/** Human due-date label + whether it's overdue. */
export function dueLabel(iso: string): { text: string; overdue: boolean } {
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  const dateStr = new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (days < 0) return { text: `Overdue · ${dateStr}`, overdue: true };
  if (days === 0) return { text: `Due today · ${dateStr}`, overdue: false };
  if (days === 1) return { text: `Tomorrow · ${dateStr}`, overdue: false };
  if (days <= 45) return { text: `In ${days} days · ${dateStr}`, overdue: false };
  return { text: dateStr, overdue: false };
}

export const REPEAT_LABEL: Record<string, string> = {
  NONE: 'One-time',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};
