import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetailScreen'>;
export type OrderDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetailScreen'>;
