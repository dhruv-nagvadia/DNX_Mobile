import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  TextInput,
  AppState,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleQuestionMark, Star } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { useReorder } from '@/hooks/useReorder';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';
import { orderPayLabel } from '@/utils/orderStatus';
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useCreateOrderReviewMutation,
  useCreateProductReviewMutation,
  useCreateOrderPaymentOrderMutation,
  useSimulateOrderPaymentMutation,
  useVerifyOrderPaymentMutation,
  useSyncOrderPaymentMutation,
} from '@/redux/api/order/orderApi';
import { useGetProviderByIdQuery, useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import {
  BillCard,
  BottomBar,
  ItemsCard,
  NoteCard,
  Notice,
  RateStoreCard,
  StatusHero,
  StoreCard,
  formatPlaced,
  orderRef,
} from './parts';
import { AMBER, styles } from './styles';

/** Per-product rating modal target (the store review is rated inline). */
type ProductTarget = { productId: string; name: string } | null;

/** Full detail of a customer's store order, with cancel while it's still open. */
export default function OrderDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.ORDER_DETAILS>>();
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const order = orders.find((o) => o.id === params.orderId);
  // The full store: photo, address, hours and location for the store card, and
  // the live catalog (current stock/price, not the order's stale snapshot) for Reorder.
  const { data: liveProvider } = useGetProviderByIdQuery(
    { id: order?.provider.id ?? '' },
    { skip: !order },
  );
  // The order's review carries only its rating — the comment and the store's
  // reply come from the store's reviews list.
  const { data: storeReviews = [] } = useGetProviderReviewsQuery(order?.provider.id ?? '', {
    skip: !order?.review,
  });
  const insets = useSafeAreaInsets();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [createOrderReview, { isLoading: submittingOrder }] = useCreateOrderReviewMutation();
  const [createProductReview, { isLoading: submittingProduct }] = useCreateProductReviewMutation();

  const [createOrderPaymentOrder, { isLoading: linking }] = useCreateOrderPaymentOrderMutation();
  const [simulateOrderPayment, { isLoading: simulatingPay }] = useSimulateOrderPaymentMutation();
  const [verifyOrderPayment, { isLoading: verifyingPay }] = useVerifyOrderPaymentMutation();
  const [syncOrderPayment] = useSyncOrderPaymentMutation();
  const awaitingPayment = useRef(false);
  const { reorder } = useReorder();

  // Product rating modal.
  const [productTarget, setProductTarget] = useState<ProductTarget>(null);
  const [productRating, setProductRating] = useState(5);
  const [productComment, setProductComment] = useState('');
  // Inline "Rate this store" card (0 = not picked yet).
  const [storeRating, setStoreRating] = useState(0);
  const [storeComment, setStoreComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState<string>();

  // On returning to the app (e.g. from the Razorpay page), reconcile the payment.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') {return;}
      if (awaitingPayment.current) {
        syncOrderPayment({ orderId: params.orderId }).catch(() => {});
      }
    });
    return () => sub.remove();
  }, [syncOrderPayment, params.orderId]);

  // Stop reconciling once it's paid, and auto-check once if it was already
  // pending when this screen opened (e.g. paid moments ago, no webhook set up).
  useEffect(() => {
    if (order?.paymentStatus === 'PAID') {
      awaitingPayment.current = false;
    } else if (order?.paymentStatus === 'PENDING' && order.paymentMethod !== 'CASH') {
      syncOrderPayment({ orderId: order.id }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  const helpButton = (
    <TouchableOpacity
      style={styles.helpBtn}
      onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Help and support"
    >
      <CircleQuestionMark size={20} color={INK} />
    </TouchableOpacity>
  );

  if (isLoading && !order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order details" right={helpButton} />
        <View style={styles.center}>
          <ActivityIndicator color={LINK} />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order details" right={helpButton} />
        <View style={styles.center}>
          <Text style={styles.notFound}>This order is no longer available.</Text>
        </View>
      </View>
    );
  }

  const pay = orderPayLabel(order);
  const due = Math.max(0, order.amountMinor - order.amountPaidMinor);
  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const canReview = order.status === 'COMPLETED' && !order.review;
  const reviewDetail = order.review ? storeReviews.find((r) => r.id === order.review?.id) : undefined;

  const address = liveProvider
    ? [
        liveProvider.addressLine,
        liveProvider.city,
        [liveProvider.state, liveProvider.postalCode].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  const onCall = () => {
    const phone = liveProvider?.phone ?? order.provider.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  // Same Google Maps link as the store page: lat/lng when known, else the address.
  const onDirections = () => {
    const destination =
      liveProvider?.latitude != null && liveProvider?.longitude != null
        ? `${liveProvider.latitude},${liveProvider.longitude}`
        : encodeURIComponent(address || order.provider.businessName);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  };

  const openStore = () =>
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: order.provider.id,
      name: order.provider.businessName,
    });

  const openProduct = (productId?: string | null) => {
    if (productId) {
      navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: order.provider.id, productId });
    }
  };

  // Re-adds this order's items to the cart at today's price/stock (shared hook).
  const onReorder = () => {
    if (!liveProvider) {
      Alert.alert('Just a moment', "Still loading this store's current catalog — try again.");
      return;
    }
    reorder(order, liveProvider);
  };

  // Which products in this order the customer has already rated.
  const productRatings = new Map((order.productReviews ?? []).map((r) => [r.productId, r.rating]));

  const openProductReview = (productId: string, name: string) => {
    setProductRating(5);
    setProductComment('');
    setProductTarget({ productId, name });
  };

  const closeProductReview = () => setProductTarget(null);

  const submitProductReview = async () => {
    if (!productTarget) {return;}
    try {
      await createProductReview({
        orderId: order.id,
        productId: productTarget.productId,
        rating: productRating,
        comment: productComment.trim() || undefined,
      }).unwrap();
      setProductTarget(null);
    } catch {
      Alert.alert('Could not submit', 'Please try again.');
    }
  };

  const submitStoreReview = async () => {
    if (!canReview) {return;}
    if (storeRating < 1) {
      Alert.alert('Pick a rating', 'Tap the stars to rate this store.');
      return;
    }
    const text = storeComment.trim() || undefined;
    try {
      await createOrderReview({ orderId: order.id, rating: storeRating, comment: text }).unwrap();
      setSubmittedComment(text);
    } catch {
      Alert.alert('Could not submit', 'Please try again.');
    }
  };

  const onCancel = () => {
    // Once the store has accepted (CONFIRMED) the order, a made-to-order item
    // (e.g. a cooked dish) has likely already started being prepared and
    // forfeits its share of the payment — but an ordinary tracked-stock item
    // (powder, face wash, etc.) just goes back on the shelf and still fully
    // refunds, so only warn when the order actually has something to forfeit.
    const lineTotal = (i: { quantity: number; priceQty: number; priceMinor: number }) =>
      Math.round((i.quantity / i.priceQty) * i.priceMinor);
    const madeToOrderTotal = order.items
      .filter((i) => i.unlimitedStock)
      .reduce((s, i) => s + lineTotal(i), 0);
    const orderTotal = order.items.reduce((s, i) => s + lineTotal(i), 0);
    const alreadyStarted = order.status === 'CONFIRMED' && order.amountPaidMinor > 0 && madeToOrderTotal > 0;
    const fullyForfeits = alreadyStarted && madeToOrderTotal >= orderTotal;

    const message = !alreadyStarted
      ? 'This will release the items back to the store.'
      : fullyForfeits
        ? "The store has likely already started preparing your order. Cancelling now won't be refunded — are you sure?"
        : "The store has likely already started preparing some items. Cancelling now won't refund those — only the other items will be. Are you sure?";

    Alert.alert('Cancel this order?', message, [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelOrder(order.id).unwrap();
            navigation.goBack();
          } catch {
            Alert.alert('Could not cancel', 'Please try again.');
          }
        },
      },
    ]);
  };

  // Only an order with nothing paid yet can be paid online here. A part-paid
  // order's remaining balance is settled in person at pickup, so offering a
  // "Pay" button for it would just be rejected by the server.
  const canPay =
    (order.status === 'PENDING' || order.status === 'CONFIRMED') &&
    order.paymentMethod !== 'CASH' &&
    order.paymentStatus === 'PENDING' &&
    due > 0;

  const onPay = async () => {
    try {
      const paymentOrder = await createOrderPaymentOrder({ orderId: order.id }).unwrap();
      if (paymentOrder.simulated) {
        await simulateOrderPayment({ orderId: order.id }).unwrap();
        Alert.alert('Payment successful', 'This order has been marked as paid.');
        return;
      }

      awaitingPayment.current = true;
      const result = await openRazorpayCheckout(paymentOrder);
      if (!result) {return;} // user dismissed the checkout sheet

      await verifyOrderPayment({
        orderId: order.id,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      }).unwrap();
      Alert.alert('Payment successful', 'This order has been marked as paid.');
    } catch {
      Alert.alert('Could not start payment', 'Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Order details"
        subtitle={`Order ${orderRef(order.id)} • Placed ${formatPlaced(order.createdAt)}`}
        right={helpButton}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StatusHero order={order} />

        {/* No-show — no refund if paid, just a warning if it was cash */}
        {order.status === 'NO_SHOW' && (
          <Notice
            title="You didn't collect this order"
            text={
              order.paymentMethod === 'CASH'
                ? 'Repeated no-shows may lead to charges or your account being blocked.'
                : order.paymentStatus === 'REFUNDED'
                  ? `${formatMoney(order.amountPaidMinor, order.currency)} has been refunded since nothing had been prepared.`
                  : (order.refundedMinor ?? 0) > 0
                    ? `${formatMoney(order.refundedMinor ?? 0, order.currency)} will be refunded, but ${formatMoney(order.amountPaidMinor - (order.refundedMinor ?? 0), order.currency)} isn't since those items were already being prepared.`
                    : order.amountPaidMinor > 0
                      ? "Your payment isn't refundable since you didn't collect it."
                      : "You didn't come to collect this order."
            }
          />
        )}

        {/* Cancellation / no-show note from the store */}
        {(order.status === 'CANCELLED' || order.status === 'NO_SHOW') && order.cancelReason ? (
          <Notice
            title={order.status === 'NO_SHOW' ? "Store's note" : 'Cancelled by the store'}
            text={order.cancelReason}
          />
        ) : null}

        <StoreCard
          order={order}
          store={liveProvider}
          address={address}
          onCall={onCall}
          onDirections={onDirections}
          onViewStore={openStore}
        />

        <ItemsCard
          order={order}
          showRating={order.status === 'COMPLETED'}
          productRatings={productRatings}
          onRate={openProductReview}
          onOpenProduct={openProduct}
        />

        <BillCard
          order={order}
          pay={pay}
          due={due}
          canPay={canPay}
          paying={linking || simulatingPay || verifyingPay}
          onPay={onPay}
        />

        {!!order.note && <NoteCard note={order.note} />}

        {(canReview || order.review) && (
          <RateStoreCard
            businessName={order.provider.businessName}
            review={order.review}
            reviewDetail={reviewDetail}
            submittedComment={submittedComment}
            rating={storeRating}
            onRating={setStoreRating}
            comment={storeComment}
            onComment={setStoreComment}
            onSubmit={submitStoreReview}
            submitting={submittingOrder}
          />
        )}
      </ScrollView>

      <BottomBar
        status={order.status}
        bottomInset={insets.bottom}
        canCancel={canCancel}
        cancelling={cancelling}
        onCancel={onCancel}
        onDirections={onDirections}
        onReorder={onReorder}
        onViewStore={openStore}
      />

      {/* Product rating modal */}
      <Modal
        visible={productTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeProductReview}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate this product</Text>
            <Text style={styles.modalSub}>{productTarget?.name}</Text>

            <View style={styles.modalStars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setProductRating(n)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
                  accessibilityState={{ selected: n <= productRating }}
                >
                  <Star size={34} color={AMBER} fill={n <= productRating ? AMBER : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share a few words (optional)"
              placeholderTextColor={Color.placeholder}
              value={productComment}
              onChangeText={setProductComment}
              multiline
              maxLength={1000}
              accessibilityLabel="Product review comment (optional)"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalGhost]}
                activeOpacity={0.85}
                onPress={closeProductReview}
                disabled={submittingProduct}
                accessibilityRole="button"
              >
                <Text style={styles.modalGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalPrimary]}
                activeOpacity={0.85}
                onPress={submitProductReview}
                disabled={submittingProduct}
                accessibilityRole="button"
                accessibilityState={{ busy: submittingProduct }}
              >
                {submittingProduct ? (
                  <ActivityIndicator color={Color.white} />
                ) : (
                  <Text style={styles.modalPrimaryText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
