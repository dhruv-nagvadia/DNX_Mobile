import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProductsRouteProp = RouteProp<RootStackParamList, 'ProductsScreen'>;
export type ProductsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductsScreen'>;
