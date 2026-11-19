import { useCallback, useMemo } from 'react';
import { Linking, Share } from 'react-native';

import {
  useGetApplicablePlatformCouponsQuery,
  useGetStoreCouponsQuery,
} from '@/redux/api/order/orderApi';
import { StoreCoupon } from '@/redux/api/order/types';
import { Provider, Review } from '@/redux/api/provider/types';

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon … Sun
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** One line of the weekly hours table. */
export interface HoursRow {
  day: string;
  hours: string | null; // null = closed
  isToday: boolean;
}

/** The headline offer shown under the quick actions. */
export interface OfferInfo {
  title: string;
  code: string;
}

export interface RatingShare {
  star: number;
  pct: number;
}

function offerTitle(
  c: Pick<StoreCoupon, 'discountType' | 'discountValue' | 'description'>,
): string {
  const off =
    c.discountType === 'PERCENT'
      ? `${c.discountValue}% OFF`
      : `₹${Math.round(c.discountValue / 100).toLocaleString('en-IN')} OFF`;
  const desc = c.description?.trim();
  if (!desc) {
    return off;
  }
  // The owner's description usually already states the discount ("50% off your
  // first visit") — use it as-is then, so the amount isn't shown twice.
  return /%|₹|\boff\b|\bflat\b|\bdiscount\b/i.test(desc) ? desc : `${off} • ${desc}`;
}

function fmt(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * Everything the redesigned business pages (service and store) share beyond
 * their own booking / shopping logic: the headline offer, rating breakdown,
 * weekly hours, full address, and the Directions / Share actions (no Call:
 * the business's number is only shared after a booking/order).
 */
export function useBusinessExtras(
  provider: Provider | undefined,
  reviews: Review[],
  usage: 'BOOKING' | 'ORDER',
) {
  const providerId = provider?.id ?? '';
  const skip = !provider;
  const { data: storeCoupons = [] } = useGetStoreCouponsQuery(providerId, { skip });
  const { data: platformCoupons = [] } = useGetApplicablePlatformCouponsQuery(
    { providerId, usage },
    { skip },
  );

  // One headline offer: the business's own coupon first, else a platform one.
  const offer = useMemo<OfferInfo | null>(() => {
    const c = storeCoupons[0] ?? platformCoupons[0];
    return c ? { title: offerTitle(c), code: c.code } : null;
  }, [storeCoupons, platformCoupons]);

  // Share of each star rating (5 → 1) across the loaded reviews.
  const ratingBreakdown = useMemo<RatingShare[]>(() => {
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: Math.round((reviews.filter((r) => Math.round(r.rating) === star).length / total) * 100),
    }));
  }, [reviews]);

  const hoursRows = useMemo<HoursRow[]>(() => {
    const today = new Date().getDay();
    return WEEK_ORDER.map((dow) => {
      const h = provider?.businessHours.find((b) => b.dayOfWeek === dow);
      return {
        day: DAY_SHORT[dow],
        hours: h?.isOpen ? `${fmt(h.openTime)} – ${fmt(h.closeTime)}` : null,
        isToday: dow === today,
      };
    });
  }, [provider]);

  const address = provider
    ? [
        provider.addressLine,
        provider.city,
        [provider.state, provider.postalCode].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  const onDirections = useCallback(() => {
    if (!provider) {
      return;
    }
    const destination =
      provider.latitude != null && provider.longitude != null
        ? `${provider.latitude},${provider.longitude}`
        : encodeURIComponent(address || provider.businessName);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  }, [provider, address]);

  const onShare = useCallback(() => {
    if (!provider) {
      return;
    }
    Share.share({
      message: `${provider.businessName}${address ? ` — ${address}` : ''}\nOn DNX.`,
    }).catch(() => undefined);
  }, [provider, address]);

  return { offer, ratingBreakdown, hoursRows, address, onDirections, onShare };
}
