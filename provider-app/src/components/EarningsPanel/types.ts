export type EarningsPeriod = 'week' | 'month' | 'year';

export interface EarningsPanelProps {
  businessId: string;
  /** SERVICE businesses chart bookings, STORE businesses chart orders. */
  isStore: boolean;
}
