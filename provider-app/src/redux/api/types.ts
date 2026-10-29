// Shared API types used across all domains.

/** Standard success envelope returned by the backend. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export type Role = 'USER' | 'PROVIDER' | 'ADMIN';
