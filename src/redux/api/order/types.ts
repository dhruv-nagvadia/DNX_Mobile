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
  // Message the provider left when they cancelled the order.
  cancelReason?: string | null;
  // Coupon applied at checkout (amountMinor is already the discounted total).
  discountMinor?: number;
  couponCode?: string | null;
  createdAt: string;
  items: OrderItem[];
  provider: {
    id: string;
    businessName: string;
    phone?: string | null;
    images?: string[];
    category: { slug: string; name: string };
  };
  // The customer's review of this order, once left (COMPLETED orders only).
  review?: { id: string; rating: number } | null;
  // Per-product ratings the customer left for items in this order.
  productReviews?: { productId: string; rating: number }[];
}

export interface CreateOrderReviewRequest {
  orderId: string;
  rating: number;
  comment?: string;
}

export interface CreateProductReviewRequest {
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
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
  couponCode?: string;
}

export interface ValidateCouponRequest {
  providerId: string;
  code: string;
  subtotalMinor: number;
}

export interface CouponPreview {
  code: string;
  description?: string | null;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  discountMinor: number;
  finalMinor: number;
}

// A coupon as advertised to customers on a store (before applying).
export interface StoreCoupon {
  code: string;
  description?: string | null;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  minOrderMinor: number;
  maxDiscountMinor?: number | null;
  expiresAt?: string | null;
}

export interface CreateOrderResponse {
  order: Order;
  simulated: boolean;
}
