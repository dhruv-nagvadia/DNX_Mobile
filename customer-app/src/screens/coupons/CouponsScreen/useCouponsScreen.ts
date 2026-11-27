import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAppliedCoupon, clearAppliedCoupon } from '@/redux/slices/couponSlice';
import {
  useGetApplicablePlatformCouponsQuery,
  useGetStoreCouponsQuery,
  useValidateCouponMutation,
} from '@/redux/api/order/orderApi';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { PlatformCoupon, StoreCoupon } from '@/redux/api/order/types';
import { couponEligibility } from '@/components/CouponSheet';

import { CouponsNavigationProp, CouponsRouteProp } from './types';
import { apiErrorMessage } from '@/utils/apiError';

export interface CouponRow {
  coupon: StoreCoupon;
  /** STORE = the business's own code; PLATFORM = an app-wide offer. */
  source: 'STORE' | 'PLATFORM';
  ok: boolean;
  hint?: string;
}

/** A platform coupon in the store-coupon shape (ORDER scope, min-subtotal only),
 * same normalisation the shared CouponList uses. */
function platformToRowShape(c: PlatformCoupon): StoreCoupon {
  return {
    code: c.code,
    description: c.description,
    discountType: c.discountType,
    discountValue: c.discountValue,
    scope: 'ORDER',
    minOrderMinor: c.minOrderMinor,
    maxDiscountMinor: c.maxDiscountMinor,
    expiresAt: c.expiresAt,
  };
}

/** Full-screen coupon list for one business — apply a code, then return to checkout. */
export function useCouponsScreen() {
  const navigation = useNavigation<CouponsNavigationProp>();
  const { params } = useRoute<CouponsRouteProp>();
  const dispatch = useAppDispatch();

  const applied = useAppSelector((s) => s.coupons.applied[params.providerId]);
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const [validateCoupon, { isLoading: applying }] = useValidateCouponMutation();
  const [error, setError] = useState<string | null>(null);
  // Which code the last apply was for — so a failure shows on that card (or the input).
  const [attemptedCode, setAttemptedCode] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  // Same lookups the shared CouponList makes (cached from the opening screen).
  const { data: storeCoupons = [], isFetching: fetchingStore } = useGetStoreCouponsQuery(
    params.providerId,
  );
  const { data: platformCoupons = [], isFetching: fetchingPlatform } =
    useGetApplicablePlatformCouponsQuery({
      providerId: params.providerId,
      usage: params.serviceId ? 'BOOKING' : 'ORDER',
    });
  // Only for the header subtitle — usually already cached from the store page.
  const { data: provider } = useGetProviderByIdQuery({ id: params.providerId, postalCode });

  const rows = useMemo<CouponRow[]>(() => {
    const ctx = {
      subtotalMinor: params.subtotalMinor,
      serviceId: params.serviceId,
      items: params.items,
    };
    const all: { coupon: StoreCoupon; source: CouponRow['source'] }[] = [
      ...storeCoupons.map((c) => ({ coupon: c, source: 'STORE' as const })),
      ...platformCoupons.map((c) => ({
        coupon: platformToRowShape(c),
        source: 'PLATFORM' as const,
      })),
    ];
    return all.map((r) => ({ ...r, ...couponEligibility(r.coupon, ctx, params.currency) }));
  }, [
    storeCoupons,
    platformCoupons,
    params.subtotalMinor,
    params.serviceId,
    params.items,
    params.currency,
  ]);

  const applyCoupon = useCallback(
    async (code: string) => {
      setError(null);
      setAttemptedCode(code);
      try {
        const preview = await validateCoupon({
          providerId: params.providerId,
          code,
          subtotalMinor: params.subtotalMinor,
          serviceId: params.serviceId,
          items: params.items,
        }).unwrap();
        dispatch(setAppliedCoupon({ providerId: params.providerId, coupon: preview }));
        navigation.goBack();
      } catch (err) {
        setError(apiErrorMessage(err, 'That code didn’t work.'));
      }
    },
    [
      dispatch,
      navigation,
      params.providerId,
      params.subtotalMinor,
      params.serviceId,
      params.items,
      validateCoupon,
    ],
  );

  const applyManual = useCallback(() => {
    const code = manualCode.trim();
    if (code) {
      applyCoupon(code);
    }
  }, [applyCoupon, manualCode]);

  const removeCoupon = useCallback(() => {
    dispatch(clearAppliedCoupon(params.providerId));
  }, [dispatch, params.providerId]);

  const isManualAttempt = !!attemptedCode && !rows.some((r) => r.coupon.code === attemptedCode);

  return {
    businessName: provider?.businessName,
    isBooking: !!params.serviceId,
    subtotalMinor: params.subtotalMinor,
    currency: params.currency,
    rows,
    isFetching: fetchingStore || fetchingPlatform,
    applied,
    applying,
    error,
    attemptedCode,
    isManualAttempt,
    manualCode,
    setManualCode,
    applyCoupon,
    applyManual,
    removeCoupon,
  };
}
