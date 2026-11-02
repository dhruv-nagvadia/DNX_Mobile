export interface TopItem {
  name: string;
  count: number;
  revenueMinor: number;
  imageUrl?: string | null;
}

export interface BusiestDay {
  day: string;
  /** Average sales on that weekday (per date that had any). */
  avg: number;
}

export interface TopSellersData {
  items: TopItem[];
  currency: string;
  busiestDay: BusiestDay | null;
  itemLabel: 'product' | 'service';
}

export interface TopSellersPanelProps {
  businessId: string;
  isStore: boolean;
  /** How many top items to list (default 3). */
  limit?: number;
}
