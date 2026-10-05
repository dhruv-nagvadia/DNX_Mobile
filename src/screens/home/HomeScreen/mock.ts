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

// The top hero carousel — value-prop banners, swapped in for the old
// "Trusted by thousands" stat banner until we have real numbers worth showing.
export const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'h1',
    image: Images.bannerServicesShopping,
    headline: 'Services & shopping,\none app',
    subtitle: 'Book a pro or order from local stores — all in DNX.',
    textPosition: 'left',
  },
  {
    id: 'h2',
    image: Images.bannerFreshGroceries,
    headline: 'Daily essentials,\ndelivered fast',
    subtitle: 'Groceries, pharmacy & more from stores near you.',
    textPosition: 'left',
  },
  {
    id: 'h3',
    image: Images.bannerVerifiedLocal,
    headline: 'Verified local businesses you can trust',
    subtitle: 'Every provider on DNX is reviewed & verified.',
    textPosition: 'bottom',
  },
];
