import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useGetMyBusinessQuery,
  useUpdateCouponMutation,
} from '@/redux/api/business/businessApi';
import { Coupon } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import { CouponsNavigationProp, CouponsRouteProp } from './types';

export type CouponStatus = 'active' | 'off' | 'expired' | 'usedUp';
export type CouponFilter = 'all' | CouponStatus;

const SOON_MS = 7 * 24 * 60 * 60 * 1000;

export interface CouponState {
  status: CouponStatus;
  expiringSoon: boolean;
}

/** Derives a coupon's display status from its API fields. Expired and
 * used-up win over the on/off switch. */
export function couponState(c: Coupon, now: number = Date.now()): CouponState {
  const expiresAt = c.expiresAt ? new Date(c.expiresAt).getTime() : NaN;
  const hasExpiry = !Number.isNaN(expiresAt);
  const expired = hasExpiry && expiresAt < now;
  const usedUp = c.usageLimit != null && c.usedCount >= c.usageLimit;
  if (expired) {
    return { status: 'expired', expiringSoon: false };
  }
  if (usedUp) {
    return { status: 'usedUp', expiringSoon: false };
  }
  if (!c.isActive) {
    return { status: 'off', expiringSoon: false };
  }
  return { status: 'active', expiringSoon: hasExpiry && expiresAt - now <= SOON_MS };
}

export function useCouponsScreen() {
  const route = useRoute<CouponsRouteProp>();
  const navigation = useNavigation<CouponsNavigationProp>();
  const { businessId } = route.params;

  const { data: coupons = [], isLoading, isFetching, refetch } = useGetCouponsQuery(businessId);
  const { data: business } = useGetMyBusinessQuery(businessId);
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CouponFilter>('all');

  // Recomputed whenever the list changes (incl. pull-to-refresh), so "now"
  // stays fresh enough for expiry checks.
  const states = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, CouponState>();
    for (const c of coupons) {
      map.set(c.id, couponState(c, now));
    }
    return map;
  }, [coupons]);

  // Summary tiles are over ALL coupons, not the filtered list.
  const counts = useMemo(() => {
    let active = 0;
    let expiringSoon = 0;
    let timesUsed = 0;
    for (const c of coupons) {
      const s = states.get(c.id);
      if (s?.status === 'active') {
        active += 1;
      }
      if (s?.expiringSoon) {
        expiringSoon += 1;
      }
      timesUsed += c.usedCount;
    }
    return { active, expiringSoon, timesUsed };
  }, [coupons, states]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coupons.filter((c) => {
      if (filter !== 'all' && states.get(c.id)?.status !== filter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [c.code, c.description].some((s) => !!s && s.toLowerCase().includes(q));
    });
  }, [coupons, states, query, filter]);

  const toggleActive = (coupon: Coupon) => {
    updateCoupon({ businessId, couponId: coupon.id, data: { isActive: !coupon.isActive } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (couponId: string) => {
    deleteCoupon({ businessId, couponId }).unwrap().catch(() => undefined);
  };

  return {
    businessName: business?.businessName,
    coupons,
    filtered,
    states,
    counts,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    deleting,
    toggleActive,
    remove,
    goBack: () => navigation.goBack(),
    addCoupon: () => navigation.navigate(ROUTES.COUPON_FORM, { businessId }),
    editCoupon: (couponId: string) => navigation.navigate(ROUTES.COUPON_FORM, { businessId, couponId }),
  };
}
