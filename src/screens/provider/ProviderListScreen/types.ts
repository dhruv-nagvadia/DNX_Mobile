import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProviderListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProviderListScreen'
>;

export type ProviderListRouteProp = RouteProp<RootStackParamList, 'ProviderListScreen'>;
