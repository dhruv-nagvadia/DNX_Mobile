import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, ShieldCheck, ShoppingBag, ShoppingCart, X } from 'lucide-react-native';

import { LINK, PAGE_BG } from '@/utils/modernTheme';
import { useAppDispatch } from '@/redux/hooks';
import { clearProviderItems } from '@/redux/slices/cartSlice';
import { providerApi } from '@/redux/api/provider/providerApi';
import {
  useCreateOrderMutation,
  useStartOrderCheckoutMutation,
  useConfirmOrderCheckoutMutation,
  useSyncOrderCheckoutMutation,
} from '@/redux/api/order/orderApi';
import type { CheckoutConfirmResult, PlacedCheckoutOrder } from '@/redux/api/order/types';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { StepList } from './parts';
import { styles } from './styles';
import { apiErrorMessage } from '@/utils/apiError';

type Stage = 'placing' | 'awaiting-payment' | 'confirming';
const STAGES: Stage[] = ['placing', 'awaiting-payment', 'confirming'];

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
  const insets = useSafeAreaInsets();
  // Centered content: keep it clear of the status bar and the home indicator /
  // Android navigation bar (the app draws edge-to-edge).
  const safePad = { paddingTop: 32 + insets.top, paddingBottom: 32 + insets.bottom };
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
  const [failure, setFailure] = useState<{ failedNames: string[]; message?: string } | null>(null);

  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
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
      dispatch(
        providerApi.util.invalidateTags([{ type: 'Provider', id: providerId }, 'Providers']),
      );
    };

    type Placed = { orderId: string; providerName: string; amountMinor: number };

    const finish = (placed: Placed[], failed: string[], message?: string) => {
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
        setFailure({ failedNames: failed, message });
      }
    };

    // Cash on Delivery: nothing to pay now, so each store's order is just placed.
    const runCash = async () => {
      const failed: string[] = [];
      const placed: Placed[] = [];
      for (let i = 0; i < groups.length; i++) {
        if (cancelled) {
          return;
        }
        const g = groups[i];
        setStepIndex(i);
        setStage('placing');
        try {
          const res = await createOrder({
            providerId: g.providerId,
            paymentMethod: method,
            items: g.items,
            couponCode: g.couponCode,
          }).unwrap();
          onPlaced(g.providerId);
          placed.push({
            orderId: res.order.id,
            providerName: g.providerName,
            amountMinor: res.order.amountMinor,
          });
        } catch {
          failed.push(g.providerName);
        }
      }
      finish(placed, failed);
    };

    // Online / partial: the WHOLE cart — every store — is paid for in one
    // Razorpay payment. The server validates all the stores first (so nothing is
    // charged if any item is unavailable), then splits the one payment into a
    // separate order per store, each recording only its own share. The orders
    // are only created once the payment is confirmed, so a failed or cancelled
    // checkout never leaves a "placed" order (or reserved stock) behind.
    const runOnline = async () => {
      setStage('placing');

      let checkout;
      try {
        checkout = await startOrderCheckout({
          paymentMethod: method as 'ONLINE' | 'PARTIAL',
          groups: groups.map((g) => ({
            providerId: g.providerId,
            items: g.items,
            couponCode: g.couponCode,
          })),
        }).unwrap();
      } catch (err) {
        finish(
          [],
          groups.map((g) => g.providerName),
          apiErrorMessage(err),
        );
        return;
      }

      const toPlaced = (orders: PlacedCheckoutOrder[]): Placed[] =>
        orders.map((o) => ({
          orderId: o.id,
          providerName: o.businessName,
          amountMinor: o.amountMinor,
        }));

      const settle = (result: { orders: PlacedCheckoutOrder[]; failedStores: string[] }) => {
        result.orders.forEach((o) => onPlaced(o.providerId));
        finish(
          toPlaced(result.orders),
          result.failedStores,
          result.orders.length === 0
            ? 'Your payment is being refunded — nothing was ordered.'
            : undefined,
        );
      };

      if (checkout.simulated) {
        // No live keys configured — already placed & marked paid server-side.
        settle({ orders: checkout.orders ?? [], failedStores: [] });
        return;
      }
      if (!checkout.razorpayOrderId) {
        finish(
          [],
          groups.map((g) => g.providerName),
        );
        return;
      }

      setStage('awaiting-payment');
      let result: CheckoutConfirmResult | null = null;
      try {
        const paid = await openRazorpayCheckout(checkout);
        if (paid) {
          setStage('confirming');
          result = await confirmOrderCheckout({
            razorpayOrderId: paid.razorpay_order_id,
            razorpayPaymentId: paid.razorpay_payment_id,
            razorpaySignature: paid.razorpay_signature,
          }).unwrap();
        }
      } catch {
        // Fall through to the server-side sync check below — the checkout
        // sheet closing with an error, or this confirm call failing,
        // doesn't necessarily mean Razorpay didn't actually capture the
        // payment.
      }

      if (!result) {
        setStage('confirming');
        try {
          result = await syncOrderCheckout({ razorpayOrderId: checkout.razorpayOrderId }).unwrap();
        } catch {
          // Treated as not placed below.
        }
      }

      if (cancelled) {
        return;
      }
      if (result && (result.orders.length > 0 || result.failedStores.length > 0)) {
        settle(result);
      } else {
        finish(
          [],
          groups.map((g) => g.providerName),
        );
      }
    };

    const run = () => (method === 'CASH' ? runCash() : runOnline());

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
        <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
        <View style={[styles.content, safePad]}>
          <View style={styles.errorWrap}>
            <View style={styles.errorGlow} />
            <View style={styles.errorBadge}>
              <X size={46} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            Payment not completed
          </Text>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              {failure.message ?? `${failure.failedNames.join(', ')} — please try again.`} Your cart
              items are still saved.
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.9}
              accessibilityRole="button"
              onPress={() => navigation.replace(ROUTES.CART)}
            >
              <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2} />
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
      ? groups.length > 1
        ? 'Placing your orders…'
        : 'Placing your order…'
      : stage === 'awaiting-payment'
        ? 'Waiting for payment…'
        : 'Confirming your payment…';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.content, safePad]}>
        <View style={styles.spinnerWrap} accessibilityRole="progressbar" accessibilityLabel={label}>
          <View style={styles.glow} />
          <Animated.View style={[styles.ring, { transform: [{ rotate: spinDeg }] }]} />
          <Animated.View style={[styles.badge, { transform: [{ scale: pulse }] }]}>
            {stage === 'placing' ? (
              <ShoppingBag size={34} color={LINK} strokeWidth={1.9} />
            ) : (
              <CreditCard size={34} color={LINK} strokeWidth={1.9} />
            )}
          </Animated.View>
        </View>

        <Text style={styles.title} accessibilityLiveRegion="polite">
          {label}
        </Text>
        <Text style={styles.subtitle}>
          {method !== 'CASH' && groups.length > 1
            ? `${groups.length} stores · one payment`
            : groups.length > 1
              ? `${current.providerName} (${stepIndex + 1} of ${groups.length})`
              : current.providerName}
        </Text>

        {method !== 'CASH' && (
          <StepList
            steps={['Checking your order', 'Completing payment', 'Confirming payment']}
            current={STAGES.indexOf(stage)}
          />
        )}

        {method === 'CASH' && groups.length > 1 && (
          <View style={styles.storeDots}>
            {groups.map((_, i) => (
              <View key={i} style={[styles.storeDot, i === stepIndex && styles.storeDotActive]} />
            ))}
          </View>
        )}

        <View style={styles.note}>
          <ShieldCheck size={15} color="#64748B" strokeWidth={2} />
          <Text style={styles.noteText}>Please don't close the app during this step.</Text>
        </View>
      </View>
    </View>
  );
}
