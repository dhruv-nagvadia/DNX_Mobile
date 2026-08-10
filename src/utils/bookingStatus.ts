import { BookingStatus } from '@/redux/api/booking/types';
import { Color } from './Theme';

export const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
};

/** Pill colours for a status: [background, text]. */
export function statusColors(status: BookingStatus): [string, string] {
  switch (status) {
    case 'CONFIRMED':
      return [Color.primarySoft, Color.primary];
    case 'COMPLETED':
      return ['rgba(22,163,74,0.12)', Color.success];
    case 'CANCELLED':
    case 'NO_SHOW':
      return [Color.background, Color.textSecondary];
    default:
      return ['rgba(245,158,11,0.14)', Color.warning];
  }
}

/** True for upcoming, still-active bookings. */
export function isUpcomingBooking(status: BookingStatus, endTime: string): boolean {
  return (status === 'PENDING' || status === 'CONFIRMED') && new Date(endTime).getTime() >= Date.now();
}
