import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import {
  useCreateBookingMutation,
  useCreatePaymentOrderMutation,
  useSimulatePaymentMutation,
  useVerifyPaymentMutation,
} from '@/redux/api/booking/bookingApi';
import { PaymentMethod } from '@/redux/api/booking/types';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES } from '@/navigation/routes';

import { BookingSummaryRouteProp } from './types';

/** Review-and-pay step between picking a slot and choosing a payment method. */
export function useBookingSummary() {
  // Loosely typed so navigating to a nested tab screen (Bookings) type-checks.
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void; goBack: () => void }>();
  const { params } = useRoute<BookingSummaryRouteProp>();
  const dispatch = useAppDispatch();

  const { data: provider, isLoading } = useGetProviderByIdQuery(params.providerId);
  const service = provider?.services.find((s) => s.id === params.serviceId) ?? null;

  // Coupon applied via the dedicated Coupons screen (or a quick-apply chip).
  const appliedCoupon = useAppSelector((s) => s.coupons.applied[params.providerId]) ?? null;

  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();
  const [createPaymentOrder, { isLoading: linking }] = useCreatePaymentOrderMutation();
  const [simulatePayment, { isLoading: simulating }] = useSimulatePaymentMutation();
  const [verifyPayment, { isLoading: verifying }] = useVerifyPaymentMutation();

  const [methodOpen, setMethodOpen] = useState(false);

  const paymentBusy = booking || linking || simulating || verifying;

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

  // Create the booking with the chosen method, then pay if online/partial —
  // Razorpay's native checkout opens immediately, in-app (no browser).
  const chooseMethod = useCallback(
    async (method: PaymentMethod) => {
      if (!provider || !service) return;
      if (isSlotExpired()) {
        onSlotGone('This time has passed. Please pick another time.');
        return;
      }
      let created;
      try {
        created = await createBooking({
          providerId: provider.id,
          serviceId: service.id,
          startTime: params.startTime,
          paymentMethod: method,
          couponCode: appliedCoupon?.code,
        }).unwrap();
      } catch (err) {
        const status = (err as { status?: number })?.status;
        const message = (err as { data?: { message?: string } })?.data?.message;
        if (status === 409) {
          onSlotGone('That slot was just taken. Please pick another time.');
        } else if (status === 400 && message?.toLowerCase().includes('future')) {
          onSlotGone('This time has passed. Please pick another time.');
        } else {
          setMethodOpen(false);
          Alert.alert('Could not book', 'Something went wrong. Please try again.');
        }
        return;
      }

      dispatch(clearAppliedCoupon(provider.id));
      setMethodOpen(false);
      const goToBookings = () =>
        navigation.navigate(ROUTES.TABS, { screen: ROUTES.BOOKINGS });

      if (method === 'CASH') {
        Alert.alert('Booking confirmed', 'Pay cash at the venue. See it under “Your bookings”.', [
          { text: 'Done', onPress: goToBookings },
        ]);
        return;
      }

      try {
        const order = await createPaymentOrder({ bookingId: created.id }).unwrap();
        if (order.simulated) {
          await simulatePayment({ bookingId: created.id }).unwrap();
          Alert.alert('Payment successful', 'Your booking is paid and confirmed.', [
            { text: 'Done', onPress: goToBookings },
          ]);
          return;
        }

        const result = await openRazorpayCheckout(order);
        if (!result) {
          // User dismissed the checkout sheet — booking is saved, pay later.
          Alert.alert('Booked — payment pending', 'Your booking is saved. You can pay it from “Your bookings”.', [
            { text: 'OK', onPress: goToBookings },
          ]);
          return;
        }

        await verifyPayment({
          bookingId: created.id,
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        }).unwrap();
        Alert.alert('Payment successful', 'Your booking is paid and confirmed.', [
          { text: 'Done', onPress: goToBookings },
        ]);
      } catch {
        Alert.alert('Booked — payment pending', 'Your booking is saved. You can pay it from “Your bookings”.', [
          { text: 'OK', onPress: goToBookings },
        ]);
      }
    },
    [
      provider,
      service,
      params.startTime,
      appliedCoupon,
      isSlotExpired,
      onSlotGone,
      createBooking,
      createPaymentOrder,
      simulatePayment,
      verifyPayment,
      navigation,
      dispatch,
    ],
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
    paymentBusy,
  };
}
