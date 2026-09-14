import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { PaymentMethod } from '@/redux/api/booking/types';
import { ROUTES } from '@/navigation/routes';

import { BookingSummaryRouteProp } from './types';

/** Review-and-pay step between picking a slot and choosing a payment method. */
export function useBookingSummary() {
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void; goBack: () => void }>();
  const { params } = useRoute<BookingSummaryRouteProp>();

  const { data: provider, isLoading } = useGetProviderByIdQuery(params.providerId);
  const service = provider?.services.find((s) => s.id === params.serviceId) ?? null;

  // Coupon applied via the dedicated Coupons screen (or a quick-apply chip).
  const appliedCoupon = useAppSelector((s) => s.coupons.applied[params.providerId]) ?? null;

  const [methodOpen, setMethodOpen] = useState(false);

  const total = (service?.priceMinor ?? 0) - (appliedCoupon?.discountMinor ?? 0);

  // A slot picked a while ago (e.g. spent time browsing offers here) can go
  // stale by the time the customer actually pays — check before relying on it.
  const isSlotExpired = useCallback(
    () => new Date(params.startTime).getTime() < Date.now(),
    [params.startTime],
  );

  const onSlotGone = useCallback(
    (message: string) => {
      setMethodOpen(false);
      Alert.alert('Time no longer available', message, [
        { text: 'Pick another time', onPress: () => navigation.goBack() },
      ]);
    },
    [navigation],
  );

  const openPayment = useCallback(() => {
    if (isSlotExpired()) {
      onSlotGone('This time has passed. Please pick another time.');
      return;
    }
    setMethodOpen(true);
  }, [isSlotExpired, onSlotGone]);
  const closePayment = useCallback(() => setMethodOpen(false), []);

  // Hands off to a dedicated full-screen flow that creates the booking and
  // (for online/partial) opens Razorpay itself — mirrors the cart's
  // CheckoutProcessingScreen, and for the same reason: a native checkout
  // sheet needs to open from a plain, fully-settled screen, not from within
  // this modal.
  const chooseMethod = useCallback(
    (method: PaymentMethod) => {
      if (!provider || !service) return;
      if (isSlotExpired()) {
        onSlotGone('This time has passed. Please pick another time.');
        return;
      }
      setMethodOpen(false);
      navigation.navigate(ROUTES.BOOKING_PROCESSING, {
        providerId: provider.id,
        providerName: provider.businessName,
        serviceId: service.id,
        serviceName: service.name,
        startTime: params.startTime,
        method,
        couponCode: appliedCoupon?.code,
        currency: service.currency ?? 'INR',
      });
    },
    [provider, service, params.startTime, appliedCoupon, isSlotExpired, onSlotGone, navigation],
  );

  return {
    provider,
    service,
    isLoading,
    startTime: params.startTime,
    total,
    currency: service?.currency ?? 'INR',
    depositPercent: provider?.depositPercent || 20,
    appliedCoupon,
    // Payment method sheet
    methodOpen,
    openPayment,
    closePayment,
    chooseMethod,
  };
}
