// Mirrors `frontend/src/redux/api/provider/types.ts` (the web dashboard's
// provider-domain types) — same backend, same shapes. `Provider` there is
// named `Business` here since "Provider" collides with React/Redux's own
// <Provider> component in an RN app that imports both constantly.

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  durationMin: number;
  isActive?: boolean;
  travelRequired?: boolean;
  travelBaseFeeMinor?: number;
  travelPerKmMinor?: number;
  partialPayEnabled?: boolean;
}

export interface ServiceInput {
  name: string;
  description?: string;
  price: number; // major units (rupees) — the API converts to minor
  durationMin: number;
  travelRequired?: boolean;
  travelBaseFee?: number; // major units
  travelPerKm?: number; // major units
  partialPayEnabled?: boolean;
}

export type BusinessType = 'SERVICE' | 'STORE';
export type Measure = 'weight' | 'volume' | 'count';

export interface ProductInput {
  name: string;
  description?: string;
  measure: Measure;
  price: number; // major units, for `priceQty` base units
  priceQty: number; // base units
  section?: string;
  stockQty?: number; // base units
  unlimitedStock?: boolean;
  stepQty?: number; // base units
  imageUrl?: string;
  productTypeId?: string | null;
  codEnabled?: boolean;
  partialPayEnabled?: boolean;
}

export type StockAdjustmentReason = 'SALE' | 'RESTOCK' | 'DAMAGED' | 'OTHER';

export interface AdjustStockInput {
  delta: number; // positive = added, negative = removed, in base units
  reason?: StockAdjustmentReason;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  measure: Measure;
  priceMinor: number;
  priceQty: number;
  currency: string;
  unit: string;
  section?: string | null;
  stockQty: number;
  unlimitedStock?: boolean;
  stepQty: number;
  imageUrl?: string | null;
  isActive?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  productTypeId?: string | null;
  productType?: { name: string } | null;
  codEnabled?: boolean;
  partialPayEnabled?: boolean;
}

export interface BusinessHour {
  id?: string;
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
  isOpen: boolean;
  openTime: string; // "HH:MM"
  closeTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
}

export interface DateHour {
  id: string;
  date: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface DateHourInput {
  date: string; // "YYYY-MM-DD"
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

/** Fields the business-details edit screen can PATCH — mirrors the web
 * dashboard's `CreateProviderRequest`, used there for both create and edit. */
export interface UpdateBusinessRequest {
  businessName?: string;
  categoryId?: string;
  subcategoryId?: string;
  type?: BusinessType;
  phone?: string;
  email?: string;
  description?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  depositPercent?: number;
  codEnabled?: boolean;
  partialPayEnabled?: boolean;
}

export interface Business {
  id: string;
  businessName: string;
  type?: BusinessType;
  description?: string | null;
  phone: string;
  email?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  depositPercent?: number;
  codEnabled?: boolean;
  partialPayEnabled?: boolean;
  isBlocked?: boolean;
  blockedReason?: string | null;
  category: Category;
  subcategory?: Subcategory | null;
  services: Service[];
  products?: Product[];
  businessHours: BusinessHour[];
}

export type DiscountType = 'PERCENT' | 'FLAT';
// What triggers eligibility: a minimum order/booking amount, one specific
// service (SERVICE businesses), or one specific product (STORE businesses).
export type CouponScope = 'ORDER' | 'SERVICE' | 'PRODUCT';

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number; // percent (1-100) or flat amount in minor units
  scope: CouponScope;
  serviceId?: string | null;
  service?: { name: string } | null;
  productId?: string | null;
  product?: { name: string } | null;
  minOrderMinor: number;
  maxDiscountMinor?: number | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CouponInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  scope?: CouponScope;
  serviceId?: string | null;
  productId?: string | null;
  minOrderMinor?: number;
  maxDiscountMinor?: number;
  expiresAt?: string | null;
  usageLimit?: number;
  isActive?: boolean;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'ONLINE' | 'CASH' | 'PARTIAL';

export interface BusinessBooking {
  id: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  amountMinor: number;
  amountPaidMinor?: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  cancelReason?: string | null;
  service: { name: string };
  user: { fullName: string; phone?: string | null };
}

/** A booking as returned by the cross-business `getAllMyBookings` endpoint. */
export interface DashboardBooking extends BusinessBooking {
  provider: { id: string; businessName: string };
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface BusinessOrderItem {
  id: string;
  name: string;
  measure: Measure;
  priceMinor: number;
  priceQty: number;
  unit: string;
  quantity: number;
  product?: { imageUrl?: string | null } | null;
}

export interface BusinessOrder {
  id: string;
  status: OrderStatus;
  amountMinor: number;
  amountPaidMinor: number;
  refundedMinor?: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  readyAt?: string | null;
  items: BusinessOrderItem[];
  user: { fullName: string; phone?: string | null };
  provider: { id: string; businessName: string };
}

export interface BusinessReview {
  id: string;
  rating: number;
  comment?: string | null;
  providerReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  user: { fullName: string };
}

export interface EarningsParams {
  from?: string;
  to?: string;
  businessId?: string;
}

export interface EarningsTotals {
  count: number;
  grossMinor: number;
  commissionMinor: number;
  netMinor: number;
  onlineMinor: number;
  cashMinor: number;
}

export interface EarningsTransaction {
  kind: 'BOOKING' | 'ORDER';
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  status: string;
  paymentMethod: PaymentMethod;
  settledAt: string | null;
  commissionBps: number;
  grossMinor: number;
  commissionMinor: number;
  earningMinor: number;
  onlineMinor: number;
  cashMinor: number;
  // What this sale adds to (or, if cash, takes off) what DNX pays the provider.
  payableMinor: number;
}

export interface EarningsSettlement {
  id: string;
  direction: 'TO_PROVIDER' | 'FROM_PROVIDER';
  amountMinor: number;
  method: string | null;
  reference: string | null;
  note: string | null;
  paidAt: string;
}

export interface Earnings {
  range: { from?: string; to?: string };
  defaultCommissionBps: number;
  summary: EarningsTotals;
  // Open bookings/orders — what they'd be worth if completed.
  upcoming: EarningsTotals;
  balance: {
    earnedOnlineMinor: number;
    earnedCommissionMinor: number;
    paidOutMinor: number;
    receivedMinor: number;
    // Positive: the platform owes the provider; negative: the provider owes the platform.
    balanceMinor: number;
  };
  businesses: (EarningsTotals & { id: string; name: string; commissionBps: number; isCustomRate: boolean })[];
  transactions: EarningsTransaction[];
  payouts: EarningsSettlement[];
}
