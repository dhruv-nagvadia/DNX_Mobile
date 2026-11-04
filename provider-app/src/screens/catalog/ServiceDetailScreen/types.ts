import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;
export type ServiceDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServiceDetailScreen'>;
