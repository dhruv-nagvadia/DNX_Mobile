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
  | null;

/** Status chip selection — 'ALL' or one booking/order status. */
export type StatusFilter = 'ALL' | BookingStatus | OrderStatus;
