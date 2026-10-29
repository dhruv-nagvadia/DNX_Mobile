import { useNavigation, useRoute } from '@react-navigation/native';

import { useDeleteCouponMutation, useGetCouponsQuery, useUpdateCouponMutation } from '@/redux/api/business/businessApi';
import { Coupon } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import { CouponsNavigationProp, CouponsRouteProp } from './types';

export function useCouponsScreen() {
  const route = useRoute<CouponsRouteProp>();
  const navigation = useNavigation<CouponsNavigationProp>();
  const { businessId } = route.params;

  const { data: coupons = [], isLoading, isFetching, refetch } = useGetCouponsQuery(businessId);
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const toggleActive = (coupon: Coupon) => {
    updateCoupon({ businessId, couponId: coupon.id, data: { isActive: !coupon.isActive } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (couponId: string) => {
    deleteCoupon({ businessId, couponId }).unwrap().catch(() => undefined);
  };

  return {
    coupons,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    deleting,
    toggleActive,
    remove,
    addCoupon: () => navigation.navigate(ROUTES.COUPON_FORM, { businessId }),
    editCoupon: (couponId: string) => navigation.navigate(ROUTES.COUPON_FORM, { businessId, couponId }),
  };
}
