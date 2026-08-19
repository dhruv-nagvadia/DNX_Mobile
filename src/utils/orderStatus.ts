import { Order, OrderStatus } from '@/redux/api/order/types';
import { Color } from './Theme';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Placed',
  CONFIRMED: 'Confirmed',
  READY: 'Ready for pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
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
      return [Color.background, Color.textSecondary];
    default: // PENDING
      return ['rgba(245,158,11,0.14)', Color.warning];
  }
}

/** Short payment line for an order: label + colour. */
export function orderPayLabel(o: Order): { text: string; color: string } {
  if (o.paymentStatus === 'PAID') return { text: 'Paid', color: Color.success };
  if (o.paymentMethod === 'CASH') return { text: 'Pay cash at pickup', color: Color.textSecondary };
  return { text: 'Payment pending', color: Color.warning };
}
