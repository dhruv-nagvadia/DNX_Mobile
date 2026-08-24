import React, { useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CalendarDays, ChevronRight, ShoppingBag } from 'lucide-react-native';

import { ROUTES } from '@/navigation/routes';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { STATUS_LABEL, statusColors, paymentSummary } from '@/utils/bookingStatus';
import { ORDER_STATUS_LABEL, orderStatusColors, orderPayLabel } from '@/utils/orderStatus';
import { formatAmount, formatMoney } from '@/utils/units';
import { useGetMyOrdersQuery } from '@/redux/api/order/orderApi';
import type { Order } from '@/redux/api/order/types';
import type { Booking } from '@/redux/api/booking/types';

import { useBookingsScreen } from './useBookingsScreen';
import { styles } from './styles';

type Tab = 'bookings' | 'orders';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

function formatPrice(minor: number, currency: string | null): string {
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

/** Bookings & Orders tab — split into service appointments and store orders. */
export default function BookingsScreen() {
  const { bookings, isLoading: bookingsLoading, onOpen } = useBookingsScreen();
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigation = useNavigation<{ navigate: (r: string, p?: object) => void }>();
  const [tab, setTab] = useState<Tab>('bookings');

  const isLoading = tab === 'bookings' ? bookingsLoading : ordersLoading;

  const renderBooking = (b: Booking) => {
    const [pillBg, pillColor] = statusColors(b.status);
    const pay = paymentSummary(b);
    const showPay = b.status !== 'CANCELLED' && b.status !== 'NO_SHOW';
    const payText =
      b.paymentStatus === 'PARTIAL' && pay.due > 0 ? `${formatPrice(pay.due, b.currency)} due` : pay.label;
    return (
      <TouchableOpacity key={b.id} style={styles.card} activeOpacity={0.85} onPress={() => onOpen(b)}>
        <View style={styles.cardTop}>
          <View style={styles.icon}>
            {b.provider.images && b.provider.images.length > 0 ? (
              <Image source={{ uri: b.provider.images[0] }} style={styles.iconImg} />
            ) : (
              <CategoryIcon slug={b.provider.category.slug} size={22} />
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {b.provider.businessName}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {b.service.name} · {formatWhen(b.startTime)}
            </Text>
            {showPay && (
              <Text style={[styles.pay, { color: pay.color }]} numberOfLines={1}>
                {payText}
              </Text>
            )}
          </View>
          <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
            <Text style={[styles.statusText, { color: pillColor }]}>{STATUS_LABEL[b.status]}</Text>
          </View>
          <ChevronRight size={18} color={Color.placeholder} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrder = (o: Order) => {
    const [pillBg, pillColor] = orderStatusColors(o.status);
    const pay = orderPayLabel(o);
    return (
      <TouchableOpacity
        key={o.id}
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(ROUTES.ORDER_DETAILS, { orderId: o.id })}
      >
        <View style={styles.cardTop}>
          <View style={styles.icon}>
            {o.provider.images && o.provider.images.length > 0 ? (
              <Image source={{ uri: o.provider.images[0] }} style={styles.iconImg} />
            ) : (
              <CategoryIcon slug={o.provider.category.slug} size={22} />
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {o.provider.businessName}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {o.items.length} item{o.items.length > 1 ? 's' : ''} · {formatWhen(o.createdAt)}
            </Text>
            <Text style={[styles.pay, { color: pay.color }]} numberOfLines={1}>
              {pay.text}
            </Text>
          </View>
          <View style={styles.orderRight}>
            <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
              <Text style={[styles.statusText, { color: pillColor }]}>{ORDER_STATUS_LABEL[o.status]}</Text>
            </View>
            <ChevronRight size={18} color={Color.placeholder} />
          </View>
        </View>

        <View style={styles.orderItems}>
          {o.items.slice(0, 3).map((it) => (
            <Text key={it.id} style={styles.orderLine} numberOfLines={1}>
              {it.name} · {formatAmount(it.quantity, it.measure)}
            </Text>
          ))}
          {o.items.length > 3 && <Text style={styles.orderMore}>+{o.items.length - 3} more</Text>}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderFooterLabel}>Total</Text>
          <Text style={styles.orderTotal}>{formatMoney(o.amountMinor, o.currency)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const list = tab === 'bookings' ? bookings : orders;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings & Orders</Text>
      </View>

      {/* Mini header: Bookings (default) / Orders */}
      <View style={styles.segmentBar}>
        {(['bookings', 'orders'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.seg, tab === t && styles.segActive]}
            activeOpacity={0.85}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.segText, tab === t && styles.segTextActive]}>
              {t === 'bookings' ? 'Bookings' : 'Orders'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : list.length === 0 ? (
        <View style={styles.center}>
          {tab === 'bookings' ? (
            <CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />
          ) : (
            <ShoppingBag size={48} color={Color.placeholder} strokeWidth={1.4} />
          )}
          <Text style={styles.emptyTitle}>{tab === 'bookings' ? 'No bookings yet' : 'No orders yet'}</Text>
          <Text style={styles.emptyText}>
            {tab === 'bookings'
              ? 'Book a service from the Home tab and it will show up here.'
              : 'Order from a store on the Home tab and it will show up here.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tab === 'bookings' ? bookings.map(renderBooking) : orders.map(renderOrder)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
