import { TrustStat } from './types';

/**
 * Static placeholder content for the home screen. Replace each of these with a
 * real API query when the corresponding feature is built.
 *
 * (Offers for you is no longer here — it's now real platform coupons, fetched
 * in useHomeScreen.ts via useGetPlatformCouponsQuery.)
 */

export const LOCATION = 'Ahmedabad';

/**
 * Static "most booked" popularity order for categories (swap for a real
 * booking-count sort later). Categories not listed here fall back to the
 * server's sortOrder.
 */
export const POPULAR_CATEGORY_ORDER: string[] = [
  'healthcare',
  'beauty',
  'home',
  'fitness',
  'food',
  'automotive',
  'education',
  'professional',
  'retail',
  'events',
  'government',
  'other',
];

export const TRUST_STATS: TrustStat[] = [
  { id: 't1', value: '50k+', label: 'Happy users' },
  { id: 't2', value: '1L+', label: 'Bookings' },
  { id: 't3', value: '10k+', label: 'Verified pros' },
];
