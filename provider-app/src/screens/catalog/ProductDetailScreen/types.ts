import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetailScreen'>;
export type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetailScreen'>;
