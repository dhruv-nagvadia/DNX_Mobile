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

export type BusinessType = 'SERVICE' | 'STORE';

/** A sellable item in a STORE business's catalog. */
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  unit: string; // "kg", "litre", "piece"…
  section?: string | null;
  stockQty: number;
  imageUrl?: string | null;
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
  type?: BusinessType;
  description?: string | null;
  phone: string;
  email?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  depositPercent?: number;
  category: Category;
  subcategory?: Subcategory | null;
  services: Service[];
  products?: Product[];
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
  type?: BusinessType;
  page?: number;
  limit?: number;
}

export type ProvidersResponse = ApiEnvelope<Paginated<Provider>>;
export type ProviderResponse = ApiEnvelope<Provider>;
