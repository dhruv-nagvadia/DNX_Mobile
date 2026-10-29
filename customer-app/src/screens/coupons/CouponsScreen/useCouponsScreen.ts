import { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAppliedCoupon, clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { useValidateCouponMutation } from '@/redux/api/order/orderApi';

import { CouponsNavigationProp, CouponsRouteProp } from './types';

/** Full-screen coupon list for one business — apply a code, then return to checkout. */
export function useCouponsScreen() {
  const navigation = useNavigation<CouponsNavigationProp>();
  const { params } = useRoute<CouponsRouteProp>();
  const dispatch = useAppDispatch();

  const applied = useAppSelector((s) => s.coupons.applied[params.providerId]);
  const [validateCoupon, { isLoading: applying }] = useValidateCouponMutation();
  const [error, setError] = useState<string | null>(null);

  const applyCoupon = useCallback(
    async (code: string) => {
      setError(null);
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
        const msg = (err as { data?: { message?: string } })?.data?.message;
        setError(msg || 'That code didn’t work.');
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

  const removeCoupon = useCallback(() => {
    dispatch(clearAppliedCoupon(params.providerId));
  }, [dispatch, params.providerId]);

  return {
    providerId: params.providerId,
    subtotalMinor: params.subtotalMinor,
    currency: params.currency,
    serviceId: params.serviceId,
    items: params.items,
    applied,
    applying,
    error,
    applyCoupon,
    removeCoupon,
  };
}
