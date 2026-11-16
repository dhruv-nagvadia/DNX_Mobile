import { ApiEnvelope } from '../types';

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  categoryId?: string;
  /** Card photo (absolute URL from the API), when one has been added. */
  imageUrl?: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  /** Card photo ("Shop by business", provider fallback) — absolute URL from the API. */
  imageUrl?: string | null;
  /** Wide banner for the Category screen; falls back to imageUrl. */
  bannerUrl?: string | null;
  // Whether this category is for service (appointment) or store (product) businesses.
  type?: 'SERVICE' | 'STORE';
  sortOrder: number;
  subcategories: Subcategory[];
}

export type CategoriesResponse = ApiEnvelope<Category[]>;
