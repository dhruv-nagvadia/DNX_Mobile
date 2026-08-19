import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, ChevronRight } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';
import { STATUS_LABEL, statusColors, paymentSummary } from '@/utils/bookingStatus';
import { ORDER_STATUS_LABEL, orderStatusColors, orderPayLabel } from '@/utils/orderStatus';
import { unitShort, formatMoney } from '@/utils/units';
import { useGetMyOrdersQuery } from '@/redux/api/order/orderApi';

import { useBookingsScreen } from './useBookingsScreen';
import { styles } from './styles';

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

/** Bookings tab — service appointments + store pickup orders. */
export default function BookingsScreen() {
  const { bookings, isLoading: bookingsLoading, onOpen } = useBookingsScreen();
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery();

  const isLoading = bookingsLoading || ordersLoading;
  const isEmpty = bookings.length === 0 && orders.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your orders & bookings</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      ) : isEmpty ? (
        <View style={styles.center}>
          <CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>
            Book a service or order from a store on the Home tab and it will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Store orders */}
          {orders.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Store orders</Text>
              {orders.map((o) => {
                const [pillBg, pillColor] = orderStatusColors(o.status);
                const pay = orderPayLabel(o);
                return (
                  <View key={o.id} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={styles.icon}>
                        <CategoryIcon slug={o.provider.category.slug} size={22} />
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
                      <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
                        <Text style={[styles.statusText, { color: pillColor }]}>
                          {ORDER_STATUS_LABEL[o.status]}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.orderItems}>
                      {o.items.slice(0, 3).map((it) => (
                        <Text key={it.id} style={styles.orderLine} numberOfLines={1}>
                          {it.name} × {it.quantity} {unitShort(it.unit)}
                        </Text>
                      ))}
                      {o.items.length > 3 && (
                        <Text style={styles.orderMore}>+{o.items.length - 3} more</Text>
                      )}
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderFooterLabel}>Total</Text>
                      <Text style={styles.orderTotal}>{formatMoney(o.amountMinor, o.currency)}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Service appointments */}
          {bookings.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Appointments</Text>
              {bookings.map((b) => {
                const [pillBg, pillColor] = statusColors(b.status);
                const pay = paymentSummary(b);
                const showPay = b.status !== 'CANCELLED' && b.status !== 'NO_SHOW';
                const payText =
                  b.paymentStatus === 'PARTIAL' && pay.due > 0
                    ? `${formatPrice(pay.due, b.currency)} due`
                    : pay.label;
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() => onOpen(b)}
                  >
                    <View style={styles.cardTop}>
                      <View style={styles.icon}>
                        <CategoryIcon slug={b.provider.category.slug} size={22} />
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
                        <Text style={[styles.statusText, { color: pillColor }]}>
                          {STATUS_LABEL[b.status]}
                        </Text>
                      </View>
                      <ChevronRight size={18} color={Color.placeholder} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
