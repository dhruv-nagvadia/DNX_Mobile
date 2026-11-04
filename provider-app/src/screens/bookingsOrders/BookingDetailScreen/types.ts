import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';
import { DashboardBooking } from '@/redux/api/business/types';

export type BookingDetailRouteProp = RouteProp<RootStackParamList, 'BookingDetailScreen'>;
export type BookingDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingDetailScreen'>;

/**
 * The booking as the provider API returns it. `providerBookingSelect` on the
 * backend also sends the on-location fields below; the shared
 * `BusinessBooking` type doesn't declare them yet, so they're added here
 * (all optional — older bookings / in-salon services have none).
 */
export type BookingDetail = DashboardBooking & {
  serviceAddressLine?: string | null;
  serviceLat?: number | null;
  serviceLng?: number | null;
  travelFeeMinor?: number;
};
