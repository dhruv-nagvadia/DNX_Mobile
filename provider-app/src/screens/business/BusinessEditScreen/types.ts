import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type BusinessEditRouteProp = RouteProp<RootStackParamList, 'BusinessEditScreen'>;
export type BusinessEditNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessEditScreen'>;

export interface BusinessEditForm {
  businessName: string;
  phone: string;
  email: string;
  description: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}
