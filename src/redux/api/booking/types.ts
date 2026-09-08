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
  provider: { id: string; businessName: string; images?: string[]; category: { slug: string; name: string } };
  service: { id: string; name: string; durationMin: number };
  review: { id: string; rating: number } | null;
}

export interface PaymentLinkResponse {
  simulated: boolean;
  url?: string;
  amount: number;
  currency: string;
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
}
