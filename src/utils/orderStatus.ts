import { Order, OrderStatus } from '@/redux/api/order/types';
import { Color } from './Theme';
import { formatMoney } from './units';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Placed',
  CONFIRMED: 'Confirmed',
  READY: 'Ready for pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
};

/** Pill colours for an order status: [background, text]. */
export function orderStatusColors(status: OrderStatus): [string, string] {
  switch (status) {
    case 'CONFIRMED':
      return [Color.primarySoft, Color.primary];
    case 'READY':
      return ['rgba(245,158,11,0.14)', Color.warning];
    case 'COMPLETED':
      return ['rgba(22,163,74,0.12)', Color.success];
    case 'CANCELLED':
    case 'NO_SHOW':
      return [Color.background, Color.textSecondary];
    default: // PENDING
      return ['rgba(245,158,11,0.14)', Color.warning];
  }
}

/** Short payment line for an order: label + colour. */
export function orderPayLabel(o: Order): { text: string; color: string } {
  if (o.paymentStatus === 'REFUNDED') return { text: 'Refunded', color: Color.primary };
  // A cancelled/no-show mixed cart can refund only the static-item portion —
  // paymentStatus stays as-is (e.g. PAID) since it's not a full refund.
  if ((o.refundedMinor ?? 0) > 0) return { text: 'Partially refunded', color: Color.warning };
  if (o.paymentStatus === 'PAID') return { text: 'Paid', color: Color.success };
  // Partial pay: the deposit went through online, the rest is paid at pickup.
  if (o.paymentStatus === 'PARTIAL') {
    const due = Math.max(0, o.amountMinor - o.amountPaidMinor);
    return { text: `Part-paid · ${formatMoney(due, o.currency)} due at pickup`, color: Color.warning };
  }
  if (o.paymentMethod === 'CASH') return { text: 'Pay cash at pickup', color: Color.textSecondary };
  return { text: 'Payment pending', color: Color.warning };
}
