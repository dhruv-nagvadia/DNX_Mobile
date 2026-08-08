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
