import { ApiEnvelope, Paginated } from '../types';
import { Category } from '../category/types';

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  durationMin: number;
}

export interface Provider {
  id: string;
  businessName: string;
  description?: string | null;
  phone: string;
  email?: string | null;
  city?: string | null;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  category: Category;
  services: Service[];
}

export interface ListProvidersParams {
  categorySlug?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type ProvidersResponse = ApiEnvelope<Paginated<Provider>>;
export type ProviderResponse = ApiEnvelope<Provider>;
