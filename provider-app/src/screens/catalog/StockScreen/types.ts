import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/routes';
import { StockAdjustmentReason } from '@/redux/api/business/types';

export type StockRouteProp = RouteProp<RootStackParamList, 'StockScreen'>;

export const REASON_OPTIONS: { value: StockAdjustmentReason; label: string }[] = [
  { value: 'SALE', label: 'Offline sale' },
  { value: 'RESTOCK', label: 'Restock' },
  { value: 'DAMAGED', label: 'Damaged / lost' },
  { value: 'OTHER', label: 'Other' },
];
