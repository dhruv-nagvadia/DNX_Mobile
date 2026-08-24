import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Store, ShoppingBag } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { formatAmount, formatMoney, amountPrice } from '@/utils/units';
import { ORDER_STATUS_LABEL, orderStatusColors, orderPayLabel } from '@/utils/orderStatus';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '@/redux/api/order/orderApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

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
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, typeof ROUTES.ORDER_DETAILS>>();
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

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
        {/* Summary */}
        <View style={styles.summary}>
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
        </View>

        {/* Items */}
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
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
            </View>
          ))}
        </View>

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
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Paid</Text>
            <Text style={styles.rowValue}>{formatMoney(order.amountPaidMinor, order.currency)}</Text>
          </View>
          {due > 0 && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Due</Text>
              <Text style={[styles.rowValue, styles.due]}>{formatMoney(due, order.currency)}</Text>
            </View>
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
    </View>
  );
}
