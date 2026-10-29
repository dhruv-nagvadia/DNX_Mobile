import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';
import { DashboardBooking, BusinessOrder } from '@/redux/api/business/types';

export type BookingsOrdersRouteProp = RouteProp<RootStackParamList, 'BookingsOrdersScreen'>;

export type ListTab = 'bookings' | 'orders';

export type PendingAction =
  | { kind: 'cancelBooking'; booking: DashboardBooking }
  | { kind: 'cancelOrder'; order: BusinessOrder }
  | { kind: 'collectBooking'; booking: DashboardBooking }
  | null;
