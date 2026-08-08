import { Color } from '@/utils/Theme';
import { Offer, RecentProvider, TrustStat } from './types';

/**
 * Static placeholder content for the home screen. Replace each of these with a
 * real API query when the corresponding feature is built.
 */

export const LOCATION = 'Ahmedabad';

export const OFFERS: Offer[] = [
  { id: 'o1', title: 'Flat 50% OFF', subtitle: 'On your first salon visit', tag: 'NEW50', bg: Color.primary },
  { id: 'o2', title: 'Free health checkup', subtitle: 'With any doctor booking', tag: 'HEALTH', bg: Color.primaryDark },
  { id: 'o3', title: '₹200 OFF cleaning', subtitle: 'Use code CLEAN200', tag: 'CLEAN200', bg: Color.ink2 },
];

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

export const RECENTLY_VIEWED: RecentProvider[] = [
  { id: 'rp1', name: 'Sharma Dental Clinic', type: 'Dentist', categorySlug: 'healthcare', rating: 4.8 },
  { id: 'rp2', name: 'GlowUp Salon', type: 'Unisex Salon', categorySlug: 'beauty', rating: 4.6 },
  { id: 'rp3', name: 'FitZone Gym', type: 'Gym', categorySlug: 'fitness', rating: 4.7 },
];

export const TRUST_STATS: TrustStat[] = [
  { id: 't1', value: '50k+', label: 'Happy users' },
  { id: 't2', value: '1L+', label: 'Bookings' },
  { id: 't3', value: '10k+', label: 'Verified pros' },
];
