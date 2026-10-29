import { ApiEnvelope } from '../types';

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  categoryId?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  // Whether this category is for service (appointment) or store (product) businesses.
  type?: 'SERVICE' | 'STORE';
  sortOrder: number;
  subcategories: Subcategory[];
}

export type CategoriesResponse = ApiEnvelope<Category[]>;
