import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProviderProductsNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ProviderProductsRouteProp = RouteProp<RootStackParamList, 'ProviderProductsScreen'>;
