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
  subtitle: string;
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
