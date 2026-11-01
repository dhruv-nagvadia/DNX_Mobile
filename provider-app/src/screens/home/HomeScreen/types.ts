import { DashboardBooking, Product } from '@/redux/api/business/types';

export interface AttentionItem {
  booking: DashboardBooking;
  confirm: boolean;
  collect: boolean;
  due: number;
}

export interface LowStockItem {
  product: Product;
  businessId: string;
  businessName: string;
  level: 'out' | 'low';
}
