import { Product } from '@/redux/api/business/types';

export interface LowStockItem {
  product: Product;
  businessId: string;
  businessName: string;
  level: 'out' | 'low';
}
