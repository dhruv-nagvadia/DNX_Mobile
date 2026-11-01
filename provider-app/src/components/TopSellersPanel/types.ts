export interface TopItem {
  name: string;
  count: number;
  revenueMinor: number;
  imageUrl?: string | null;
}

export interface TopSellersData {
  items: TopItem[];
  currency: string;
  busiestDay: string | null;
  itemLabel: 'product' | 'service';
}

export interface TopSellersPanelProps {
  businessId: string;
  isStore: boolean;
}
