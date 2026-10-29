import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProviderDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProviderDetailsScreen'
>;

export type ProviderDetailRouteProp = RouteProp<RootStackParamList, 'ProviderDetailsScreen'>;
