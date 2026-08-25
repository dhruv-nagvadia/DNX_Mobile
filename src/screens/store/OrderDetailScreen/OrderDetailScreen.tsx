import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Store, ShoppingBag, Star, ChevronRight } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { formatAmount, formatMoney, amountPrice } from '@/utils/units';
import { ORDER_STATUS_LABEL, orderStatusColors, orderPayLabel } from '@/utils/orderStatus';
import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useCreateOrderReviewMutation,
  useCreateProductReviewMutation,
} from '@/redux/api/order/orderApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

type ReviewTarget = { kind: 'order' } | { kind: 'product'; productId: string; name: string } | null;

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Full detail of a customer's store order, with cancel while it's still open. */
export default function OrderDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.ORDER_DETAILS>>();
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [createOrderReview, { isLoading: submittingOrder }] = useCreateOrderReviewMutation();
  const [createProductReview, { isLoading: submittingProduct }] = useCreateProductReviewMutation();
  const submittingReview = submittingOrder || submittingProduct;

  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const reviewOpen = reviewTarget !== null;

  const order = orders.find((o) => o.id === params.orderId);

  if (isLoading && !order) {
    return (
      <View style={styles.container}>
        <AppHeader title="Order" />
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <AppHeader title="Order" />
        <View style={styles.center}>
          <Text style={styles.notFound}>This order is no longer available.</Text>
        </View>
      </View>
    );
  }

  const [pillBg, pillColor] = orderStatusColors(order.status);
  const pay = orderPayLabel(order);
  const due = Math.max(0, order.amountMinor - order.amountPaidMinor);
  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const canReview = order.status === 'COMPLETED' && !order.review;

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

  // Which products in this order the customer has already rated.
  const productRatings = new Map((order.productReviews ?? []).map((r) => [r.productId, r.rating]));

  const openOrderReview = () => {
    setRating(5);
    setComment('');
    setReviewTarget({ kind: 'order' });
  };

  const openProductReview = (productId: string, name: string) => {
    setRating(5);
    setComment('');
    setReviewTarget({ kind: 'product', productId, name });
  };

  const closeReview = () => setReviewTarget(null);

  const submitReview = async () => {
    if (!reviewTarget) return;
    try {
      if (reviewTarget.kind === 'order') {
        await createOrderReview({
          orderId: order.id,
          rating,
          comment: comment.trim() || undefined,
        }).unwrap();
      } else {
        await createProductReview({
          orderId: order.id,
          productId: reviewTarget.productId,
          rating,
          comment: comment.trim() || undefined,
        }).unwrap();
      }
      setReviewTarget(null);
    } catch {
      Alert.alert('Could not submit', 'Please try again.');
    }
  };

  const onCancel = () =>
    Alert.alert('Cancel this order?', 'This will release the items back to the store.', [
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

  return (
    <View style={styles.container}>
      <AppHeader title="Order details" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary — tap to open the store */}
        <TouchableOpacity style={styles.summary} activeOpacity={0.85} onPress={openStore}>
          <View style={styles.avatar}>
            {order.provider.images && order.provider.images.length > 0 ? (
              <Image source={{ uri: order.provider.images[0] }} style={styles.avatarImg} />
            ) : (
              <CategoryIcon slug={order.provider.category.slug} size={28} />
            )}
          </View>
          <Text style={styles.bizName}>{order.provider.businessName}</Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Store size={13} color={Color.primaryDark} />
              <Text style={styles.chipText}>Pickup order</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
              <Text style={[styles.statusText, { color: pillColor }]}>
                {ORDER_STATUS_LABEL[order.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.placed}>Placed {formatWhen(order.createdAt)}</Text>
          <View style={styles.viewLink}>
            <Text style={styles.viewLinkText}>View store</Text>
            <ChevronRight size={14} color={Color.primary} />
          </View>
        </TouchableOpacity>

        {/* Cancellation note from the store */}
        {order.status === 'CANCELLED' && order.cancelReason ? (
          <View style={styles.cancelNote}>
            <Text style={styles.cancelNoteLabel}>Cancelled by the store</Text>
            <Text style={styles.cancelNoteText}>{order.cancelReason}</Text>
          </View>
        ) : null}

        {/* Items */}
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((it) => (
            <TouchableOpacity
              key={it.id}
              style={styles.itemRow}
              activeOpacity={it.productId ? 0.7 : 1}
              disabled={!it.productId}
              onPress={() => openProduct(it.productId)}
            >
              <View style={styles.itemThumb}>
                {it.product?.imageUrl ? (
                  <Image source={{ uri: it.product.imageUrl }} style={styles.itemThumbImg} />
                ) : (
                  <ShoppingBag size={18} color={Color.primary} />
                )}
              </View>
              <View style={styles.itemMain}>
                <Text style={styles.itemName}>{it.name}</Text>
                <Text style={styles.itemMeta}>{formatAmount(it.quantity, it.measure)}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatMoney(amountPrice(it.quantity, it.priceQty, it.priceMinor), order.currency)}
              </Text>
              {it.productId ? <ChevronRight size={16} color={Color.placeholder} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* Rate the individual products (completed orders) */}
        {order.status === 'COMPLETED' && order.items.some((it) => it.productId) && (
          <>
            <Text style={styles.sectionTitle}>Rate the products</Text>
            <View style={styles.card}>
              {order.items
                .filter((it) => it.productId)
                .map((it) => {
                  const rated = productRatings.get(it.productId as string);
                  return (
                    <View key={it.id} style={styles.rateRow}>
                      <Text style={styles.rateName} numberOfLines={1}>
                        {it.name}
                      </Text>
                      {rated ? (
                        <View style={styles.rateStars}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={15}
                              color={Color.warning}
                              fill={n <= rated ? Color.warning : 'transparent'}
                            />
                          ))}
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.rateProductBtn}
                          activeOpacity={0.8}
                          onPress={() => openProductReview(it.productId as string, it.name)}
                        >
                          <Star size={13} color={Color.primary} />
                          <Text style={styles.rateProductText}>Rate</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
            </View>
          </>
        )}

        {/* Payment */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Method</Text>
            <Text style={styles.rowValue}>{order.paymentMethod === 'CASH' ? 'Cash at pickup' : 'Online'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total</Text>
            <Text style={styles.priceValue}>{formatMoney(order.amountMinor, order.currency)}</Text>
          </View>
          {order.paymentStatus === 'REFUNDED' ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Refunded</Text>
              <Text style={[styles.rowValue, { color: pay.color }]}>
                {formatMoney(order.amountPaidMinor, order.currency)}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Paid</Text>
                <Text style={styles.rowValue}>
                  {formatMoney(order.amountPaidMinor, order.currency)}
                </Text>
              </View>
              {due > 0 && (
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Due</Text>
                  <Text style={[styles.rowValue, styles.due]}>
                    {formatMoney(due, order.currency)}
                  </Text>
                </View>
              )}
            </>
          )}
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={[styles.rowValue, { color: pay.color }]}>{pay.text}</Text>
          </View>
        </View>

        {!!order.note && (
          <>
            <Text style={styles.sectionTitle}>Note</Text>
            <View style={styles.card}>
              <Text style={styles.note}>{order.note}</Text>
            </View>
          </>
        )}

        {/* Your store review, once left */}
        {order.review && (
          <>
            <Text style={styles.sectionTitle}>Your store review</Text>
            <View style={[styles.card, styles.ratingRow]}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  color={Color.warning}
                  fill={n <= (order.review?.rating ?? 0) ? Color.warning : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{order.review.rating}.0</Text>
            </View>
          </>
        )}

        {canReview && (
          <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.85} onPress={openOrderReview}>
            <Star size={16} color={Color.white} fill={Color.white} />
            <Text style={styles.reviewText}>Review this store</Text>
          </TouchableOpacity>
        )}

        {canCancel && (
          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onCancel} disabled={cancelling}>
            {cancelling ? (
              <ActivityIndicator color={Color.error} />
            ) : (
              <Text style={styles.cancelText}>Cancel order</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Review modal */}
      <Modal visible={reviewOpen} transparent animationType="fade" onRequestClose={closeReview}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {reviewTarget?.kind === 'product' ? 'Rate this product' : 'Review this store'}
            </Text>
            <Text style={styles.modalSub}>
              {reviewTarget?.kind === 'product' ? reviewTarget.name : order.provider.businessName}
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                  <Star size={34} color={Color.warning} fill={n <= rating ? Color.warning : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share a few words (optional)"
              placeholderTextColor={Color.placeholder}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={1000}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalGhost]}
                activeOpacity={0.85}
                onPress={closeReview}
                disabled={submittingReview}
              >
                <Text style={styles.modalGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalPrimary]}
                activeOpacity={0.85}
                onPress={submitReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
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
