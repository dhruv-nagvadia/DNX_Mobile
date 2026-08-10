import { ApiEnvelope, Paginated } from '../types';
import { Category, Subcategory } from '../category/types';

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  durationMin: number;
}

export interface BusinessHour {
  id?: string;
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
  isOpen: boolean;
  openTime: string; // "HH:MM"
  closeTime: string;
}

/** A date-specific override of the weekly hours (future dates only). */
export interface DateHour {
  id: string;
  date: string; // ISO date (may include a T00:00:00Z suffix)
  isOpen: boolean;
  openTime: string; // "HH:MM"
  closeTime: string;
}

export interface Provider {
  id: string;
  businessName: string;
  description?: string | null;
  phone: string;
  email?: string | null;
  city?: string | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  category: Category;
  subcategory?: Subcategory | null;
  services: Service[];
  businessHours: BusinessHour[];
  dateHours?: DateHour[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { fullName: string };
}

export interface ListProvidersParams {
  categorySlug?: string;
  subcategorySlug?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type ProvidersResponse = ApiEnvelope<Paginated<Provider>>;
export type ProviderResponse = ApiEnvelope<Provider>;
