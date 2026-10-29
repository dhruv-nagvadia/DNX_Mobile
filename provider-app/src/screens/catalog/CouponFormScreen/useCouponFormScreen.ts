import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useGetMyBusinessQuery,
  useUpdateCouponMutation,
} from '@/redux/api/business/businessApi';
import { CouponScope } from '@/redux/api/business/types';

import { CouponForm, CouponFormNavigationProp, CouponFormRouteProp } from './types';

const EMPTY: CouponForm = {
  code: '',
  description: '',
  discountType: 'PERCENT',
  discountValue: '',
  maxDiscount: '',
  scope: 'ORDER',
  serviceId: '',
  productId: '',
  minOrder: '',
  expiresAt: '',
  usageLimit: '',
  isActive: true,
};

const toRupees = (minor?: number | null) => (minor ? String(minor / 100) : '');
const toMinor = (rupees: string) => Math.round(Number(rupees) * 100);

/** Ports `frontend/src/components/CouponsManager/useCouponsManager.ts`'s form logic. */
export function useCouponFormScreen() {
  const route = useRoute<CouponFormRouteProp>();
  const navigation = useNavigation<CouponFormNavigationProp>();
  const { businessId, couponId } = route.params;
  const isNew = !couponId;

  const { data: business } = useGetMyBusinessQuery(businessId);
  // Reuses CouponsScreen's already-subscribed cache entry for this businessId.
  const { data: coupons } = useGetCouponsQuery(businessId);
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();

  const [form, setForm] = useState<CouponForm>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const isStore = business?.type === 'STORE';
  const itemScope: CouponScope = isStore ? 'PRODUCT' : 'SERVICE';

  useEffect(() => {
    if (isNew || !coupons) return;
    const c = coupons.find((x) => x.id === couponId);
    if (!c) return;
    setForm({
      code: c.code,
      description: c.description ?? '',
      discountType: c.discountType,
      discountValue: c.discountType === 'FLAT' ? toRupees(c.discountValue) : String(c.discountValue),
      maxDiscount: toRupees(c.maxDiscountMinor),
      scope: c.scope,
      serviceId: c.serviceId ?? '',
      productId: c.productId ?? '',
      minOrder: toRupees(c.minOrderMinor),
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      isActive: c.isActive,
    });
  }, [isNew, coupons, couponId]);

  const onChange = useCallback(<K extends keyof CouponForm>(key: K, value: CouponForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setScope = useCallback((scope: CouponScope) => {
    setForm((prev) => ({ ...prev, scope, serviceId: '', productId: '', minOrder: '' }));
  }, []);

  const submit = useCallback(async () => {
    setError(null);
    const code = form.code.trim();
    const value = Number(form.discountValue);

    if (code.length < 2) return setError('Enter a coupon code');
    if (!/^[A-Za-z0-9_-]+$/.test(code)) return setError('Code can use letters, numbers, - or _');
    if (!Number.isFinite(value) || value <= 0) return setError('Enter a valid discount');
    if (form.discountType === 'PERCENT' && value > 100) return setError('A percentage can’t be over 100');
    if (form.scope === itemScope && !(itemScope === 'SERVICE' ? form.serviceId : form.productId)) {
      return setError(`Pick a ${itemScope === 'SERVICE' ? 'service' : 'product'}`);
    }

    const data = {
      code,
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: form.discountType === 'FLAT' ? toMinor(form.discountValue) : Math.round(value),
      scope: form.scope,
      serviceId: form.scope === 'SERVICE' ? form.serviceId : null,
      productId: form.scope === 'PRODUCT' ? form.productId : null,
      minOrderMinor: form.scope === 'ORDER' && form.minOrder.trim() ? toMinor(form.minOrder) : 0,
      maxDiscountMinor:
        form.discountType === 'PERCENT' && form.maxDiscount.trim() ? toMinor(form.maxDiscount) : undefined,
      expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : isNew ? undefined : null,
      usageLimit: form.usageLimit.trim() ? Number(form.usageLimit) : undefined,
      isActive: form.isActive,
    };

    try {
      if (isNew) {
        await createCoupon({ businessId, data }).unwrap();
      } else {
        await updateCoupon({ businessId, couponId: couponId!, data }).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setError(msg || 'Could not save this coupon. Please try again.');
    }
  }, [form, isNew, itemScope, businessId, couponId, createCoupon, updateCoupon, navigation]);

  return {
    isNew,
    isStore,
    itemScope,
    services: business?.services ?? [],
    products: business?.products ?? [],
    form,
    onChange,
    setScope,
    error,
    saving: creating || updating,
    submit,
  };
}
