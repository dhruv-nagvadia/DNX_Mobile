export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderPaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderPaymentMethod = 'ONLINE' | 'CASH' | 'PARTIAL';

export interface OrderItem {
  id: string;
  productId?: string | null;
  name: string;
  measure: 'weight' | 'volume' | 'count';
  priceMinor: number; // price for `priceQty` base units
  priceQty: number;
  unit: string;
  quantity: number; // base units
  product?: { imageUrl?: string | null } | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  amountMinor: number;
  amountPaidMinor: number;
  currency: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  note?: string | null;
  createdAt: string;
  items: OrderItem[];
  provider: {
    id: string;
    businessName: string;
    phone?: string | null;
    images?: string[];
    category: { slug: string; name: string };
  };
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  providerId: string;
  items: CreateOrderItem[];
  paymentMethod: OrderPaymentMethod;
  note?: string;
}

export interface CreateOrderResponse {
  order: Order;
  simulated: boolean;
}
