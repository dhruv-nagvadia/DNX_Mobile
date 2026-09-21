import { ApiEnvelope } from '../types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'ONLINE' | 'CASH' | 'PARTIAL';

export interface Booking {
  id: string;
  status: BookingStatus;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  amountMinor: number | null;
  discountMinor?: number;
  couponCode?: string | null;
  amountPaidMinor: number;
  currency: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cancelReason: string | null;
  serviceAddressLine?: string | null;
  travelFeeMinor?: number;
  provider: { id: string; businessName: string; images?: string[]; category: { slug: string; name: string } };
  service: { id: string; name: string; durationMin: number; travelRequired?: boolean };
  review: { id: string; rating: number } | null;
}

/**
 * Either a test-mode "already settled" signal, or the details the native
 * Razorpay Checkout SDK needs to open in-app (no browser/payment-link involved).
 */
export interface PaymentOrderResponse {
  simulated: boolean;
  // Set when `simulated` is true and the resource (order/booking) was already
  // placed & marked paid server-side (test mode — no live keys configured).
  orderId?: string;
  razorpayOrderId?: string;
  keyId?: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  email?: string;
  contact?: string;
}

export interface VerifyPaymentResult {
  paymentStatus: PaymentStatus;
}

export type MyBookingsResponse = ApiEnvelope<Booking[]>;

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

/** An already-booked interval, used to hide unavailable time slots. */
export interface BookedSlot {
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
}

export interface CreateBookingRequest {
  providerId: string;
  serviceId: string;
  startTime: string; // ISO datetime
  paymentMethod?: PaymentMethod;
  couponCode?: string;
  // Required when the selected service is on-location (Service.travelRequired).
  serviceAddress?: { line: string; latitude?: number; longitude?: number };
}
