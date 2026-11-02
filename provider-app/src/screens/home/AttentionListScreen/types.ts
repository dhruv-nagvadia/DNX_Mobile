import { DashboardBooking } from '@/redux/api/business/types';

export interface AttentionItem {
  booking: DashboardBooking;
  confirm: boolean;
  collect: boolean;
  due: number;
}
