import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type BookingSummaryNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type BookingSummaryRouteProp = RouteProp<RootStackParamList, 'BookingSummaryScreen'>;
