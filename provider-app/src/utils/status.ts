import { BadgeTone } from '@/components/StatusBadge';
import { BookingStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@/redux/api/business/types';
import { formatMoney } from './money';

/** Mirrors the web dashboard's Badge tone mapping for order statuses. */
export function orderStatusBadge(status: OrderStatus): { label: string; tone: BadgeTone } {
  switch (status) {
    case 'PENDING':
      return { label: 'New', tone: 'warning' };
    case 'CONFIRMED':
      return { label: 'Confirmed', tone: 'accent' };
    case 'READY':
      return { label: 'Ready for pickup', tone: 'brand' };
    case 'COMPLETED':
      return { label: 'Completed', tone: 'success' };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral' };
    case 'NO_SHOW':
      return { label: 'No-show', tone: 'error' };
  }
}

/** Mirrors the web dashboard's Badge tone mapping for booking statuses. */
export function bookingStatusBadge(status: BookingStatus): { label: string; tone: BadgeTone } {
  switch (status) {
    case 'PENDING':
      return { label: 'Pending', tone: 'warning' };
    case 'CONFIRMED':
      return { label: 'Confirmed', tone: 'accent' };
    case 'COMPLETED':
      return { label: 'Completed', tone: 'success' };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral' };
    case 'NO_SHOW':
      return { label: 'No-show', tone: 'neutral' };
  }
}

export interface PaymentFacts {
  status: OrderStatus | BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amountMinor: number;
  amountPaidMinor?: number;
  refundedMinor?: number;
  currency: string;
}

/** Same payment-state language on both orders and bookings (shared logic on the web). */
export function paymentBadge(f: PaymentFacts): { label: string; tone: BadgeTone } {
  const paid = f.amountPaidMinor ?? 0;
  const due = f.amountMinor - paid;

  if (f.refundedMinor && f.refundedMinor > 0 && f.refundedMinor < f.amountMinor) {
    return { label: `Partially refunded ${formatMoney(f.refundedMinor, f.currency)}`, tone: 'accent' };
  }
  if (f.paymentStatus === 'PAID') {
    return { label: f.paymentMethod === 'CASH' ? 'Paid (cash)' : 'Paid', tone: 'success' };
  }
  if (f.paymentStatus === 'PARTIAL') {
    return { label: `Part-paid · ${formatMoney(due, f.currency)} due`, tone: 'accent' };
  }
  if (f.paymentStatus === 'REFUNDED') {
    return { label: `Refunded ${formatMoney(f.refundedMinor ?? f.amountMinor, f.currency)}`, tone: 'neutral' };
  }
  if (f.paymentStatus === 'FAILED') {
    return { label: 'Failed', tone: 'warning' };
  }
  if (f.paymentMethod === 'CASH') {
    return { label: 'Cash · at pickup', tone: 'warning' };
  }
  return { label: 'Payment pending', tone: 'warning' };
}

export function orderOutstanding(o: { amountMinor: number; amountPaidMinor: number }): number {
  return o.amountMinor - o.amountPaidMinor;
}

export function orderNeedsCollection(o: {
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountMinor: number;
  amountPaidMinor: number;
}): boolean {
  return (
    o.status !== 'CANCELLED' &&
    (o.paymentMethod === 'CASH' || o.paymentMethod === 'PARTIAL') &&
    o.paymentStatus !== 'PAID' &&
    o.paymentStatus !== 'REFUNDED' &&
    orderOutstanding(o) > 0
  );
}

export function bookingNeedsCollection(b: {
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  amountMinor: number;
  amountPaidMinor?: number;
}): boolean {
  const due = b.amountMinor - (b.amountPaidMinor ?? 0);
  return (
    b.status !== 'CANCELLED' &&
    (b.paymentMethod === 'CASH' || b.paymentMethod === 'PARTIAL') &&
    b.paymentStatus !== 'PAID' &&
    b.paymentStatus !== 'REFUNDED' &&
    due > 0
  );
}
