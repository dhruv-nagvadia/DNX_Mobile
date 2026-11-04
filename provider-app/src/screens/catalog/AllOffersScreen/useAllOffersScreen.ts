import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useGetMyBusinessesQuery,
  useUpdateCouponMutation,
} from '@/redux/api/business/businessApi';
import { Coupon } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';
import { CouponFilter, CouponState, couponState } from '@/screens/catalog/CouponsScreen/useCouponsScreen';

import { AllOffersNavigationProp } from './types';

export const ALL_BUSINESSES = 'all';

export interface BusinessChip {
  id: string;
  name: string;
}

export function useAllOffersScreen() {
  const navigation = useNavigation<AllOffersNavigationProp>();

  const {
    data: coupons = [],
    isLoading: couponsLoading,
    isFetching: couponsFetching,
    refetch: refetchCoupons,
  } = useGetAllCouponsQuery();
  const {
    data: businesses = [],
    isLoading: businessesLoading,
    isFetching: businessesFetching,
    refetch: refetchBusinesses,
  } = useGetMyBusinessesQuery();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CouponFilter>('all');
  const [businessFilter, setBusinessFilter] = useState<string>(ALL_BUSINESSES);
  const [sheetOpen, setSheetOpen] = useState(false);

  // One chip per business; coupons whose business isn't in the list (should
  // not happen) still get a chip so they can be filtered.
  const businessChips = useMemo<BusinessChip[]>(() => {
    const chips: BusinessChip[] = businesses.map((b) => ({ id: b.id, name: b.businessName }));
    const seen = new Set(chips.map((c) => c.id));
    for (const c of coupons) {
      if (c.provider && !seen.has(c.provider.id)) {
        seen.add(c.provider.id);
        chips.push({ id: c.provider.id, name: c.provider.businessName });
      }
    }
    return chips;
  }, [businesses, coupons]);

  const states = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, CouponState>();
    for (const c of coupons) {
      map.set(c.id, couponState(c, now));
    }
    return map;
  }, [coupons]);

  // Coupons of the selected business (or all) — tiles and counts use this.
  const scoped = useMemo(
    () =>
      businessFilter === ALL_BUSINESSES
        ? coupons
        : coupons.filter((c) => c.provider?.id === businessFilter),
    [coupons, businessFilter],
  );

  const counts = useMemo(() => {
    let active = 0;
    let expiringSoon = 0;
    let timesUsed = 0;
    for (const c of scoped) {
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
  }, [scoped, states]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((c) => {
      if (filter !== 'all' && states.get(c.id)?.status !== filter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [c.code, c.description, c.provider?.businessName].some(
        (s) => !!s && s.toLowerCase().includes(q),
      );
    });
  }, [scoped, states, query, filter]);

  const selectedBusinessName =
    businessFilter === ALL_BUSINESSES ? undefined : businessChips.find((b) => b.id === businessFilter)?.name;

  const toggleActive = (coupon: Coupon) => {
    if (!coupon.provider) {
      return;
    }
    updateCoupon({ businessId: coupon.provider.id, couponId: coupon.id, data: { isActive: !coupon.isActive } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (coupon: Coupon) => {
    if (!coupon.provider) {
      return;
    }
    deleteCoupon({ businessId: coupon.provider.id, couponId: coupon.id })
      .unwrap()
      .catch(() => undefined);
  };

  const editCoupon = (coupon: Coupon) => {
    if (!coupon.provider) {
      return;
    }
    navigation.navigate(ROUTES.COUPON_FORM, { businessId: coupon.provider.id, couponId: coupon.id });
  };

  const openForm = (businessId: string) => navigation.navigate(ROUTES.COUPON_FORM, { businessId });

  // "+" → with one business skip straight to the form; otherwise step 1 picks one.
  const startCreate = () => {
    if (businesses.length === 0) {
      navigation.navigate(ROUTES.BUSINESSES);
      return;
    }
    if (businesses.length === 1) {
      openForm(businesses[0].id);
      return;
    }
    setSheetOpen(true);
  };

  const chooseBusiness = (businessId: string) => {
    setSheetOpen(false);
    openForm(businessId);
  };

  const refresh = () => {
    refetchCoupons();
    refetchBusinesses();
  };

  const isLoading = couponsLoading || businessesLoading;

  return {
    coupons,
    scoped,
    filtered,
    states,
    counts,
    businesses,
    businessChips,
    businessFilter,
    setBusinessFilter,
    selectedBusinessName,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing: !isLoading && (couponsFetching || businessesFetching),
    refresh,
    deleting,
    toggleActive,
    remove,
    editCoupon,
    startCreate,
    sheetOpen,
    closeSheet: () => setSheetOpen(false),
    chooseBusiness,
    goBack: () => navigation.goBack(),
    goToBusinesses: () => navigation.navigate(ROUTES.BUSINESSES),
  };
}
