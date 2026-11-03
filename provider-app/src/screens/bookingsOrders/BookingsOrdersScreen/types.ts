import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';
import {
  BookingStatus,
  DashboardBooking,
  BusinessOrder,
  OrderStatus,
} from '@/redux/api/business/types';

export type BookingsOrdersRouteProp = RouteProp<RootStackParamList, 'BookingsOrdersScreen'>;

export type ListTab = 'bookings' | 'orders';

export type PendingAction =
  | { kind: 'cancelBooking'; booking: DashboardBooking }
  | { kind: 'cancelOrder'; order: BusinessOrder }
  | { kind: 'collectBooking'; booking: DashboardBooking }
  | { kind: 'collectOrder'; order: BusinessOrder }
  | null;

/** Status chip selection — 'ALL' or one booking/order status. */
export type StatusFilter = 'ALL' | BookingStatus | OrderStatus;

/** Orders-view chip keys; 'CANCELLED' also covers NO_SHOW. */
export type OrderChip = 'ALL' | 'PENDING' | 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderStats {
  counts: Record<OrderChip, number>;
  /** Outstanding cash/part-paid money still to be collected (minor units). */
  toCollectMinor: number;
  currency: string;
}

/** Bookings-view chip keys; 'CANCELLED' also covers NO_SHOW. */
export type BookingChip =
  | 'ALL'
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingStats {
  counts: Record<BookingChip, number>;
  /** Outstanding cash/part-paid money still to be collected (minor units). */
  toCollectMinor: number;
  /** Non-cancelled bookings starting today. */
  today: number;
  currency: string;
}
