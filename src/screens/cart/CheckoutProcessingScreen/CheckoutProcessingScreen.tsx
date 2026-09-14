import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, XCircle } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { useAppDispatch } from '@/redux/hooks';
import { clearProviderItems } from '@/redux/slices/cartSlice';
import { providerApi } from '@/redux/api/provider/providerApi';
import {
  useCreateOrderMutation,
  useStartOrderCheckoutMutation,
  useConfirmOrderCheckoutMutation,
  useSyncOrderCheckoutMutation,
} from '@/redux/api/order/orderApi';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type Stage = 'placing' | 'awaiting-payment' | 'confirming';

/**
 * Runs the whole place-order/pay flow (including opening Razorpay) from a
 * dedicated full screen instead of from inside the Cart screen's payment-
 * method modal. That avoids two problems with doing it from the modal: a
 * native checkout sheet presented from within an RN <Modal> can glitch on
 * return (a flash of the screen behind it before the modal re-settles), and
 * there was no clear "this is still working" state while the order/payment
 * calls run after Razorpay closes — this screen makes both explicit so it
 * goes straight from Razorpay to the success screen, never back to the cart.
 */
export default function CheckoutProcessingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.CHECKOUT_PROCESSING>>();
  const { method, currency, groups } = params;
  const dispatch = useAppDispatch();

  const [createOrder] = useCreateOrderMutation();
  const [startOrderCheckout] = useStartOrderCheckoutMutation();
  const [confirmOrderCheckout] = useConfirmOrderCheckoutMutation();
  const [syncOrderCheckout] = useSyncOrderCheckoutMutation();

  const [stepIndex, setStepIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('placing');
  const [failure, setFailure] = useState<{ failedNames: string[] } | null>(null);

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

    const onPlaced = (providerId: string) => {
      dispatch(clearProviderItems(providerId));
      dispatch(providerApi.util.invalidateTags([{ type: 'Provider', id: providerId }, 'Providers']));
    };

    const run = async () => {
      const failed: string[] = [];
      const placed: { orderId: string; providerName: string; amountMinor: number }[] = [];

      for (let i = 0; i < groups.length; i++) {
        if (cancelled) {
          return;
        }
        const g = groups[i];
        setStepIndex(i);
        setStage('placing');

        const payload = {
          providerId: g.providerId,
          paymentMethod: method,
          items: g.items,
          couponCode: g.couponCode,
        };

        if (method === 'CASH') {
          try {
            const res = await createOrder(payload).unwrap();
            onPlaced(g.providerId);
            placed.push({ orderId: res.order.id, providerName: g.providerName, amountMinor: res.order.amountMinor });
          } catch {
            failed.push(g.providerName);
          }
          continue;
        }

        // ONLINE / PARTIAL: the payment is verified first — the order is only
        // created once that's confirmed, so a failed or cancelled checkout
        // never leaves a "placed" order (or reserved stock) behind.
        let checkout;
        try {
          checkout = await startOrderCheckout(payload).unwrap();
        } catch {
          failed.push(g.providerName);
          continue;
        }

        if (checkout.simulated) {
          // No live keys configured — already placed & marked paid server-side.
          onPlaced(g.providerId);
          placed.push({ orderId: checkout.orderId as string, providerName: g.providerName, amountMinor: checkout.amount });
          continue;
        }
        if (!checkout.razorpayOrderId) {
          failed.push(g.providerName);
          continue;
        }

        setStage('awaiting-payment');
        let orderId: string | null = null;
        try {
          const result = await openRazorpayCheckout(checkout);
          if (result) {
            setStage('confirming');
            const confirm = await confirmOrderCheckout({
              razorpayOrderId: result.razorpay_order_id,
              razorpayPaymentId: result.razorpay_payment_id,
              razorpaySignature: result.razorpay_signature,
            }).unwrap();
            orderId = confirm.orderId;
          }
        } catch {
          // Fall through to the server-side sync check below — the checkout
          // sheet closing with an error, or this confirm call failing,
          // doesn't necessarily mean Razorpay didn't actually capture the
          // payment.
        }

        if (!orderId) {
          setStage('confirming');
          try {
            const sync = await syncOrderCheckout({ razorpayOrderId: checkout.razorpayOrderId }).unwrap();
            orderId = sync.orderId;
          } catch {
            // Treated as not placed below.
          }
        }

        if (orderId) {
          onPlaced(g.providerId);
          placed.push({ orderId, providerName: g.providerName, amountMinor: checkout.amount });
        } else {
          failed.push(g.providerName);
        }
      }

      if (cancelled) {
        return;
      }

      if (placed.length > 0) {
        navigation.replace(ROUTES.ORDER_SUCCESS, {
          currency,
          placed,
          failedNames: failed.length > 0 ? failed : undefined,
        });
      } else {
        setFailure({ failedNames: failed });
      }
    };

    // Don't open Razorpay until this screen's own enter transition has fully
    // settled — presenting a native modal mid-transition can fail to appear
    // at all (the same "view is not in the window hierarchy" UIKit race that
    // used to happen dismissing the Cart screen's payment-method modal, just
    // triggered by this screen's own push/replace animation instead). A
    // fallback timer covers the rare case where `transitionEnd` never fires.
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
    // Runs exactly once — `params` is a one-time snapshot of the cart taken
    // when "Checkout" was tapped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failure) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.errorBadge}>
            <XCircle size={44} color={Color.error} />
          </View>
          <Text style={styles.title}>Payment not completed</Text>
          <Text style={styles.subtitle}>
            {failure.failedNames.join(', ')} — please try again. Your cart items are still saved.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.9}
              onPress={() => navigation.replace(ROUTES.CART)}
            >
              <Text style={styles.primaryBtnText}>Back to cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const current = groups[stepIndex];
  const label =
    stage === 'placing'
      ? 'Placing your order…'
      : stage === 'awaiting-payment'
        ? 'Waiting for payment…'
        : 'Confirming your payment…';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: spinDeg }] }]} />
          <Animated.View style={[styles.badge, { transform: [{ scale: pulse }] }]}>
            <CreditCard size={34} color={Color.primary} />
          </Animated.View>
        </View>

        <Text style={styles.title}>{label}</Text>
        <Text style={styles.subtitle}>
          {groups.length > 1 ? `${current.providerName} (${stepIndex + 1} of ${groups.length})` : current.providerName}
        </Text>

        {groups.length > 1 && (
          <View style={styles.stepsRow}>
            {groups.map((_, i) => (
              <View key={i} style={[styles.stepDot, i === stepIndex && styles.stepDotActive]} />
            ))}
          </View>
        )}

        <Text style={styles.note}>Please don't close the app during this step.</Text>
      </View>
    </View>
  );
}
