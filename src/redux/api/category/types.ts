import { ApiEnvelope } from '../types';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  sortOrder: number;
}

export type CategoriesResponse = ApiEnvelope<Category[]>;
