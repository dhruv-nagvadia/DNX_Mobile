import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarClock, XCircle } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { useAppDispatch } from '@/redux/hooks';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import {
  useCreateBookingMutation,
  useCancelBookingMutation,
  useCreatePaymentOrderMutation,
  useSimulatePaymentMutation,
  useVerifyPaymentMutation,
  useSyncPaymentMutation,
} from '@/redux/api/booking/bookingApi';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type Stage = 'booking' | 'awaiting-payment' | 'confirming';
type BookingSuccessOutcome = RootStackParamList[typeof ROUTES.BOOKING_SUCCESS]['outcome'];

/**
 * Runs the whole create-booking/pay flow (including opening Razorpay) from a
 * dedicated full screen instead of from inside the payment-method modal —
 * mirrors CheckoutProcessingScreen (the cart's equivalent) and for the same
 * reason: a native checkout sheet needs to open from a plain, fully-settled
 * screen, never mid-transition or from inside another modal.
 */
export default function BookingProcessingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.BOOKING_PROCESSING>>();
  const {
    providerId,
    providerName,
    serviceId,
    serviceName,
    startTime,
    method,
    couponCode,
    currency,
    serviceAddress,
  } = params;
  const dispatch = useAppDispatch();

  const [createBooking] = useCreateBookingMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [simulatePayment] = useSimulatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [syncPayment] = useSyncPaymentMutation();

  const [stage, setStage] = useState<Stage>('booking');
  const [failure, setFailure] = useState<{
    title: string;
    message: string;
    buttonLabel: string;
    retry: 'reschedule' | 'summary';
  } | null>(null);

  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  useEffect(() => {
    let cancelled = false;

    const goToSuccess = (
      bookingId: string,
      amountMinor: number,
      amountPaidMinor: number,
      outcome: BookingSuccessOutcome,
    ) => {
      navigation.replace(ROUTES.BOOKING_SUCCESS, {
        bookingId,
        providerName,
        serviceName,
        startTime,
        amountMinor,
        amountPaidMinor,
        currency,
        outcome,
      });
    };

    // Payment didn't go through (cancelled, or still unpaid per Razorpay) —
    // release the slot so it doesn't sit reserved-but-unpaid, and show the
    // same kind of clear failure state the cart's checkout uses, instead of
    // landing on a "booking done" screen with a payment-pending footnote.
    const failPayment = async (bookingId: string) => {
      try {
        await cancelBooking({ id: bookingId, providerId }).unwrap();
      } catch {
        // Best-effort cleanup — still show the failure state either way.
      }
      if (!cancelled) {
        setFailure({
          title: 'Payment not completed',
          message: "Your booking wasn't confirmed because the payment didn't go through. Please try again.",
          buttonLabel: 'Back to booking summary',
          retry: 'summary',
        });
      }
    };

    const run = async () => {
      let created;
      try {
        created = await createBooking({
          providerId,
          serviceId,
          startTime,
          paymentMethod: method,
          couponCode,
          serviceAddress,
        }).unwrap();
      } catch (err) {
        if (cancelled) {
          return;
        }
        const status = (err as { status?: number })?.status;
        const message = (err as { data?: { message?: string } })?.data?.message;
        if (status === 409) {
          setFailure({
            title: 'That slot was just taken',
            message: 'Please pick another time for your appointment.',
            buttonLabel: 'Pick another time',
            retry: 'reschedule',
          });
        } else if (status === 400 && message?.toLowerCase().includes('future')) {
          setFailure({
            title: 'This time has passed',
            message: 'Please pick another time for your appointment.',
            buttonLabel: 'Pick another time',
            retry: 'reschedule',
          });
        } else {
          setFailure({
            title: 'Could not book',
            message: 'Something went wrong. Please try again.',
            buttonLabel: 'Try again',
            retry: 'summary',
          });
        }
        return;
      }

      if (cancelled) {
        return;
      }
      dispatch(clearAppliedCoupon(providerId));

      if (method === 'CASH') {
        goToSuccess(created.id, created.amountMinor ?? 0, 0, 'cash');
        return;
      }

      try {
        const order = await createPaymentOrder({ bookingId: created.id }).unwrap();
        if (cancelled) {
          return;
        }

        if (order.simulated) {
          const res = await simulatePayment({ bookingId: created.id }).unwrap();
          goToSuccess(
            created.id,
            created.amountMinor ?? 0,
            order.amount,
            res.paymentStatus === 'PARTIAL' ? 'partial' : 'paid',
          );
          return;
        }

        setStage('awaiting-payment');
        const result = await openRazorpayCheckout(order);
        if (cancelled) {
          return;
        }

        if (!result) {
          // User dismissed the checkout sheet without paying.
          await failPayment(created.id);
          return;
        }

        setStage('confirming');
        try {
          const verified = await verifyPayment({
            bookingId: created.id,
            razorpayOrderId: result.razorpay_order_id,
            razorpayPaymentId: result.razorpay_payment_id,
            razorpaySignature: result.razorpay_signature,
          }).unwrap();
          if (cancelled) {
            return;
          }
          goToSuccess(
            created.id,
            created.amountMinor ?? 0,
            order.amount,
            verified.paymentStatus === 'PARTIAL' ? 'partial' : 'paid',
          );
        } catch {
          // Fall back to a server-side check — the checkout sheet closing
          // with an error doesn't necessarily mean the payment didn't land.
          if (cancelled) {
            return;
          }
          try {
            const synced = await syncPayment({ bookingId: created.id }).unwrap();
            if (cancelled) {
              return;
            }
            if (synced.paymentStatus === 'PAID' || synced.paymentStatus === 'PARTIAL') {
              goToSuccess(
                created.id,
                created.amountMinor ?? 0,
                order.amount,
                synced.paymentStatus === 'PARTIAL' ? 'partial' : 'paid',
              );
            } else {
              await failPayment(created.id);
            }
          } catch {
            await failPayment(created.id);
          }
        }
      } catch {
        // The booking was created but the payment step itself failed to even
        // start (e.g. couldn't reach Razorpay) — same treatment as a
        // cancelled/failed payment.
        await failPayment(created.id);
      }
    };

    // Don't open Razorpay until this screen's own enter transition has fully
    // settled — presenting a native modal mid-transition can fail to appear
    // at all. A fallback timer covers the rare case `transitionEnd` never fires.
    let started = false;
    const start = () => {
      if (started) {
        return;
      }
      started = true;
      run();
    };
    const unsubscribe = navigation.addListener('transitionEnd', (e) => {
      if (!e.data.closing) {
        start();
      }
    });
    const fallback = setTimeout(start, 500);

    return () => {
      cancelled = true;
      unsubscribe();
      clearTimeout(fallback);
    };
    // Runs exactly once — `params` is a one-time snapshot taken when a
    // payment method was chosen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failure) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.errorBadge}>
            <XCircle size={44} color={Color.error} />
          </View>
          <Text style={styles.title}>{failure.title}</Text>
          <Text style={styles.subtitle}>{failure.message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.9}
              onPress={() =>
                failure.retry === 'reschedule'
                  ? navigation.replace(ROUTES.PROVIDER_DETAILS, { providerId, name: providerName })
                  : navigation.replace(ROUTES.BOOKING_SUMMARY, { providerId, serviceId, startTime })
              }
            >
              <Text style={styles.primaryBtnText}>{failure.buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const label =
    stage === 'booking'
      ? 'Creating your booking…'
      : stage === 'awaiting-payment'
        ? 'Waiting for payment…'
        : 'Confirming your payment…';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: spinDeg }] }]} />
          <Animated.View style={[styles.badge, { transform: [{ scale: pulse }] }]}>
            <CalendarClock size={34} color={Color.primary} />
          </Animated.View>
        </View>

        <Text style={styles.title}>{label}</Text>
        <Text style={styles.subtitle}>
          {serviceName} at {providerName}
        </Text>

        <Text style={styles.note}>Please don't close the app during this step.</Text>
      </View>
    </View>
  );
}
