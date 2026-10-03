import { TrustStat } from './types';

/**
 * Static placeholder content for the home screen. Replace each of these with a
 * real API query when the corresponding feature is built.
 *
 * (Offers for you is no longer here — it's now real platform coupons, fetched
 * in useHomeScreen.ts via useGetPlatformCouponsQuery.)
 */

export const LOCATION = 'Ahmedabad';

export const TRUST_STATS: TrustStat[] = [
  { id: 't1', value: '50k+', label: 'Happy users' },
  { id: 't2', value: '1L+', label: 'Bookings' },
  { id: 't3', value: '10k+', label: 'Verified pros' },
];
