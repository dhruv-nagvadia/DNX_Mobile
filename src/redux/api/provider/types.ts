import { ApiEnvelope, Paginated } from '../types';

/** Which tier of the postal-code → city → state fallback actually matched. */
export type LocationScope = 'postalCode' | 'city' | 'state' | null;
import { Category, Subcategory } from '../category/types';

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  priceMinor: number;
  currency: string;
  durationMin: number;
  // On-location service — the provider travels to the customer, so booking
  // it requires an address and adds a distance-based travel fee.
  travelRequired?: boolean;
  travelBaseFeeMinor?: number;
  travelPerKmMinor?: number;
}

export type BusinessType = 'SERVICE' | 'STORE';

export type Measure = 'weight' | 'volume' | 'count';

/** A sellable item in a STORE business's catalog (amounts in base units). */
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  measure: Measure;
  priceMinor: number; // price for `priceQty` base units
  priceQty: number;
  currency: string;
  unit: string; // base unit label (g / ml / piece)
  section?: string | null;
  stockQty: number; // base units
  stepQty: number; // minimum + increment, base units
  imageUrl?: string | null;
  ratingAvg?: number;
  ratingCount?: number;
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
  latitude?: number | null;
  longitude?: number | null;
  // Present when the list was fetched with sort=nearest and coordinates.
  distanceKm?: number | null;
  // Distinct customers from the viewer's postal code who completed a
  // booking/order here — "N people from your area used this provider".
  // null when no postal code was sent with the request.
  areaCount?: number | null;
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
  providerReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  user: { fullName: string };
}

export type ProviderSort = 'rating' | 'reviews' | 'newest' | 'nearest';

export interface ListProvidersParams {
  categorySlug?: string;
  subcategorySlug?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  search?: string;
  type?: BusinessType;
  minRating?: number;
  openNow?: boolean;
  sort?: ProviderSort;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}

export interface ProviderListResult extends Paginated<Provider> {
  // null when no location filter was given at all (e.g. never fetched with
  // a postal/city/state param).
  locationScope: LocationScope;
}

export type ProvidersResponse = ApiEnvelope<ProviderListResult>;
export type ProviderResponse = ApiEnvelope<Provider>;
