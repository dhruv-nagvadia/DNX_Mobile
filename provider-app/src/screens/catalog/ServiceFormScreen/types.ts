import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ServiceFormRouteProp = RouteProp<RootStackParamList, 'ServiceFormScreen'>;
export type ServiceFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServiceFormScreen'>;

export interface ServiceForm {
  name: string;
  description: string;
  price: string; // rupees, as typed
  hours: string;
  minutes: string;
  travelRequired: boolean;
  travelBaseFee: string;
  travelPerKm: string;
  partialPayEnabled: boolean;
}
