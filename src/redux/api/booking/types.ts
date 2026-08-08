import { ApiEnvelope } from '../types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Booking {
  id: string;
  status: BookingStatus;
  startTime: string; // ISO datetime
  provider: { businessName: string; category: { slug: string; name: string } };
  service: { name: string };
}

export type MyBookingsResponse = ApiEnvelope<Booking[]>;

/** An already-booked interval, used to hide unavailable time slots. */
export interface BookedSlot {
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
}

export interface CreateBookingRequest {
  providerId: string;
  serviceId: string;
  startTime: string; // ISO datetime
}
