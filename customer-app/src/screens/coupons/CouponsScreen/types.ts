import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type CouponsNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type CouponsRouteProp = RouteProp<RootStackParamList, 'CouponsScreen'>;
