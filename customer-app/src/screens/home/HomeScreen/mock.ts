import { Images } from '@/assets/images';
import { HeroBanner } from './types';

/**
 * Static placeholder content for the home screen. Replace each of these with a
 * real API query when the corresponding feature is built.
 *
 * (Offers for you is no longer here — it's now real platform coupons, fetched
 * in useHomeScreen.ts via useGetPlatformCouponsQuery.)
 */

export const LOCATION = 'Ahmedabad';

// The top hero carousel — value-prop banners. Each picture keeps its left side quiet
// for the headline + subtitle drawn over it. Services only (stores are hidden at launch).
export const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'h1',
    image: Images.bannerServicesCollage,
    headline: 'All your local\nservices, one app',
    subtitle: 'Book trusted pros near you in a few taps.',
    textPosition: 'left',
    textTone: 'dark',
  },
  {
    id: 'h2',
    image: Images.bannerBookAndPay,
    headline: 'Book in minutes,\npay your way',
    subtitle: 'Pick a time, confirm, and pay online or in person.',
    textPosition: 'left',
    textTone: 'dark',
  },
  {
    id: 'h3',
    image: Images.bannerVerifiedPros,
    headline: 'Verified businesses\nyou can trust',
    subtitle: 'Every provider on DNX is reviewed & verified.',
    textPosition: 'left',
    textTone: 'dark',
  },
];
