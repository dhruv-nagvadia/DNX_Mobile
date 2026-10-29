import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type BookingDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type BookingDetailRouteProp = RouteProp<RootStackParamList, 'BookingDetailsScreen'>;
