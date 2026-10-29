import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';
import { CouponScope, DiscountType } from '@/redux/api/business/types';

export type CouponFormRouteProp = RouteProp<RootStackParamList, 'CouponFormScreen'>;
export type CouponFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CouponFormScreen'>;

export interface CouponForm {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  scope: CouponScope;
  serviceId: string;
  productId: string;
  minOrder: string;
  expiresAt: string; // "YYYY-MM-DD"
  usageLimit: string;
  isActive: boolean;
}
