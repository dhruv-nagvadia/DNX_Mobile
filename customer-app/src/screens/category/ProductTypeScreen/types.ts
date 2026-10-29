import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ProductTypeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductTypeScreen'
>;

export type ProductTypeScreenRouteProp = RouteProp<RootStackParamList, 'ProductTypeScreen'>;
