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
