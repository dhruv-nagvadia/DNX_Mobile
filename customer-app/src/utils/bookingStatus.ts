import { Booking, BookingStatus, PaymentMethod } from '@/redux/api/booking/types';
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

const METHOD_LABEL: Record<PaymentMethod, string> = {
  ONLINE: 'Online',
  CASH: 'Cash',
  PARTIAL: 'Partial',
};

/** Money split (in minor units) + a short status label/colour for a booking. */
export interface PaymentSummary {
  total: number;
  paid: number;
  due: number;
  methodLabel: string;
  /** Short status text, e.g. "Paid", "Part-paid", "Pay cash at venue". */
  label: string;
  color: string;
}

/** Derives the payment breakdown + a labelled status shared by list & detail. */
export function paymentSummary(b: Booking): PaymentSummary {
  const total = b.amountMinor ?? 0;
  const paid = b.amountPaidMinor;
  const due = Math.max(0, total - paid);
  const methodLabel = METHOD_LABEL[b.paymentMethod];

  let label: string;
  let color: string;
  if (b.paymentStatus === 'PAID') {
    label = 'Paid';
    color = Color.success;
  } else if (b.paymentStatus === 'PARTIAL') {
    label = 'Part-paid';
    color = Color.warning;
  } else if (b.paymentStatus === 'REFUNDED') {
    label = 'Refunded';
    color = Color.textSecondary;
  } else if (b.paymentMethod === 'CASH') {
    label = 'Pay cash at venue';
    color = Color.textSecondary;
  } else {
    label = 'Payment pending';
    color = Color.warning;
  }
  return { total, paid, due, methodLabel, label, color };
}
