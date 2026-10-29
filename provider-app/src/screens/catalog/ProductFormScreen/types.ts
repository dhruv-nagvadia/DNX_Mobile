import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';
import { Measure } from '@/redux/api/business/types';

export type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductFormScreen'>;
export type ProductFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductFormScreen'>;

export interface ProductForm {
  name: string;
  description: string;
  measure: Measure;
  unit: string;
  price: string;
  priceQty: string;
  section: string;
  trackStock: boolean;
  stockQty: string;
  stepQty: string;
  codEnabled: boolean;
  partialPayEnabled: boolean;
}
