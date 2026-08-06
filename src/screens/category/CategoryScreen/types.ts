import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type CategoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CategoryScreen'
>;

export type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'CategoryScreen'>;
