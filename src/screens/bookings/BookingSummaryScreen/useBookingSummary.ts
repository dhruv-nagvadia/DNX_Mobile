import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import {
  useCreateBookingMutation,
  useCreatePaymentLinkMutation,
  useSimulatePaymentMutation,
} from '@/redux/api/booking/bookingApi';
import { PaymentMethod } from '@/redux/api/booking/types';
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
  const [createPaymentLink, { isLoading: linking }] = useCreatePaymentLinkMutation();
  const [simulatePayment, { isLoading: simulating }] = useSimulatePaymentMutation();

  const [methodOpen, setMethodOpen] = useState(false);

  const paymentBusy = booking || linking || simulating;

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

  // Create the booking with the chosen method, then pay if online/partial.
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
      const goToBookings = () =>
        navigation.navigate(ROUTES.TABS, { screen: ROUTES.BOOKINGS });

      if (method === 'CASH') {
        setMethodOpen(false);
        Alert.alert('Booking confirmed', 'Pay cash at the venue. See it under “Your bookings”.', [
          { text: 'Done', onPress: goToBookings },
        ]);
        return;
      }

      try {
        const link = await createPaymentLink({ bookingId: created.id }).unwrap();
        setMethodOpen(false);
        if (link.simulated) {
          await simulatePayment({ bookingId: created.id }).unwrap();
          Alert.alert('Payment successful', 'Your booking is paid and confirmed.', [
            { text: 'Done', onPress: goToBookings },
          ]);
        } else if (link.url) {
          await Linking.openURL(link.url);
          Alert.alert('Complete your payment', 'Finish paying in your browser — see it under “Your bookings”.', [
            { text: 'Done', onPress: goToBookings },
          ]);
        } else {
          goToBookings();
        }
      } catch {
        setMethodOpen(false);
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
      createPaymentLink,
      simulatePayment,
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
