import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';
import { BookingStatus, OrderStatus } from '@/redux/api/business/types';

export type BusinessCalendarRouteProp = RouteProp<RootStackParamList, 'BusinessCalendarScreen'>;

export interface DayForm {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

/** A booking or an order, normalized to one shape — a store's calendar shows
 * that date's orders (by `createdAt`, no duration), a service's shows
 * bookings (by `startTime`, with a real end time). */
export interface CalendarItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  /** Service name (bookings) or "First item +N more" (orders). */
  subtitle: string;
  amountMinor: number;
  currency: string;
  status: BookingStatus | OrderStatus;
}

export type CalendarView = 'month' | 'week';

/** One row of the month view — a week, with its items aggregated. */
export interface WeekSummary {
  key: string;
  start: Date;
  end: Date;
  days: Date[];
  count: number;
  inMonth: boolean;
}

/** Where a date's hours come from — drives the cell tint and the Hours pill. */
export type HoursSource = 'weekly' | 'custom' | 'closedOverride';

/** Everything a calendar cell needs to render one date. */
export interface DayInfo {
  count: number;
  hasPending: boolean;
  hasConfirmed: boolean;
  hasCompleted: boolean;
  /** Closed by the weekly schedule (no override for this date). */
  closedWeekly: boolean;
  /** Closed by a per-date override. */
  closedOverride: boolean;
  /** Open with per-date custom hours. */
  customOpen: boolean;
}
