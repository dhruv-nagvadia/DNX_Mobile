import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CalendarDays, Search, ShoppingBag, X } from 'lucide-react-native';

import { ROUTES } from '@/navigation/routes';

import { useReorder } from '@/hooks/useReorder';
import { PAGE_BG } from '@/utils/modernTheme';
import { useGetMyOrdersQuery } from '@/redux/api/order/orderApi';
import type { Order } from '@/redux/api/order/types';
import type { Booking, BookingStatus } from '@/redux/api/booking/types';
import type { OrderStatus } from '@/redux/api/order/types';

import { BookingRow, NextUpCard, OrderRow, ReadyCard, orderRef } from './Cards';
import { useBookingsScreen } from './useBookingsScreen';
import { styles } from './styles';

type Tab = 'bookings' | 'orders';
type Filter = 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];
const ACTIVE_BOOKING: BookingStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS'];
const ACTIVE_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'READY'];
/** Recent completed items shown under "Earlier" on the Upcoming view. */
const EARLIER_PREVIEW = 2;

/** Bookings & Orders tab — split into service appointments and store orders. */
export default function BookingsScreen() {
  const { bookings, isLoading: bookingsLoading, onOpen } = useBookingsScreen();
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: true, // SERVICES-ONLY: orders not fetched for launch — remove this line to restore
  });
  const navigation = useNavigation<{
    navigate: (r: string, p?: object) => void;
    setParams: (p: object) => void;
  }>();
  const route = useRoute();
  const [tab, setTab] = useState<Tab>('bookings');
  const { reorder: reorderOrder } = useReorder();

  // Opened from elsewhere (e.g. Profile → Orders) asking for a specific list.
  // The request is cleared once applied, so asking for the same list again later works.
  const requestedTab = (route.params as { tab?: Tab } | undefined)?.tab;
  useEffect(() => {
    // SERVICES-ONLY: Orders list can't be requested for launch — restore: `|| requestedTab === 'orders'`
    if (requestedTab === 'bookings') {
      setTab(requestedTab);
      navigation.setParams({ tab: undefined });
    }
  }, [requestedTab, navigation]);

  const isLoading = tab === 'bookings' ? bookingsLoading : ordersLoading;
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // ── Bookings split ─────────────────────────────────────────────────────
  const bookingMatches = (b: Booking) =>
    !q ||
    b.provider.businessName.toLowerCase().includes(q) ||
    b.service.name.toLowerCase().includes(q);
  const activeBookings = bookings
    .filter((b) => ACTIVE_BOOKING.includes(b.status))
    .sort((x, y) => +new Date(x.startTime) - +new Date(y.startTime));
  const doneBookings = bookings
    .filter((b) => b.status === 'COMPLETED')
    .sort((x, y) => +new Date(y.startTime) - +new Date(x.startTime));
  const cancelledBookings = bookings.filter(
    (b) => b.status === 'CANCELLED' || b.status === 'NO_SHOW',
  );

  // ── Orders split ───────────────────────────────────────────────────────
  const orderMatches = (o: Order) =>
    !q ||
    o.provider.businessName.toLowerCase().includes(q) ||
    o.items.some((it) => it.name.toLowerCase().includes(q)) ||
    orderRef(o.id).toLowerCase().includes(q);
  const byNewest = (x: Order, y: Order) => +new Date(y.createdAt) - +new Date(x.createdAt);
  const activeOrders = orders.filter((o) => ACTIVE_ORDER.includes(o.status)).sort(byNewest);
  const doneOrders = orders.filter((o) => o.status === 'COMPLETED').sort(byNewest);
  const cancelledOrders = orders
    .filter((o) => o.status === 'CANCELLED' || o.status === 'NO_SHOW')
    .sort(byNewest);

  const openOrder = (o: Order) => navigation.navigate(ROUTES.ORDER_DETAILS, { orderId: o.id });
  const reschedule = (b: Booking) =>
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: b.provider.id,
      name: b.provider.businessName,
      rescheduleBookingId: b.id,
      rescheduleServiceId: b.service.id,
    });
  // Same "Reorder" as Order details: refills the cart at today's prices.
  const reorder = (o: Order) => reorderOrder(o);

  const renderBookings = () => {
    if (filter === 'completed') {
      const list = doneBookings.filter(bookingMatches);
      return list.length
        ? list.map((b) => <BookingRow key={b.id} booking={b} onOpen={() => onOpen(b)} />)
        : null;
    }
    if (filter === 'cancelled') {
      const list = cancelledBookings.filter(bookingMatches);
      return list.length
        ? list.map((b) => <BookingRow key={b.id} booking={b} onOpen={() => onOpen(b)} />)
        : null;
    }
    const list = activeBookings.filter(bookingMatches);
    const earlier = doneBookings.filter(bookingMatches).slice(0, EARLIER_PREVIEW);
    if (!list.length && !earlier.length) {
      return null;
    }
    const [next, ...rest] = list;
    return (
      <>
        {!!next && (
          <>
            <Text style={styles.section}>Next up</Text>
            <NextUpCard
              booking={next}
              onOpen={() => onOpen(next)}
              onReschedule={() => reschedule(next)}
            />
          </>
        )}
        {rest.length > 0 && <Text style={styles.section}>Upcoming</Text>}
        {rest.map((b) => (
          <BookingRow key={b.id} booking={b} onOpen={() => onOpen(b)} />
        ))}
        {earlier.length > 0 && <Text style={styles.section}>Earlier</Text>}
        {earlier.map((b) => (
          <BookingRow key={b.id} booking={b} onOpen={() => onOpen(b)} />
        ))}
      </>
    );
  };

  const renderOrders = () => {
    if (filter === 'completed' || filter === 'cancelled') {
      const list = (filter === 'completed' ? doneOrders : cancelledOrders).filter(orderMatches);
      return list.length
        ? list.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onOpen={() => openOrder(o)}
              onReorder={() => reorder(o)}
            />
          ))
        : null;
    }
    const list = activeOrders.filter(orderMatches);
    const ready = list.filter((o) => o.status === 'READY');
    const inProgress = list.filter((o) => o.status !== 'READY');
    const earlier = doneOrders.filter(orderMatches).slice(0, EARLIER_PREVIEW);
    if (!list.length && !earlier.length) {
      return null;
    }
    return (
      <>
        {ready.length > 0 && <Text style={styles.section}>Ready for pickup</Text>}
        {ready.map((o) => (
          <ReadyCard key={o.id} order={o} onOpen={() => openOrder(o)} />
        ))}
        {inProgress.length > 0 && <Text style={styles.section}>In progress</Text>}
        {inProgress.map((o) => (
          <OrderRow key={o.id} order={o} onOpen={() => openOrder(o)} />
        ))}
        {earlier.length > 0 && <Text style={styles.section}>Earlier</Text>}
        {earlier.map((o) => (
          <OrderRow key={o.id} order={o} onOpen={() => openOrder(o)} onReorder={() => reorder(o)} />
        ))}
      </>
    );
  };

  const content = tab === 'bookings' ? renderBookings() : renderOrders();
  // SERVICES-ONLY: only used by the hidden Bookings/Orders switch — uncomment to restore
  // const counts = { bookings: activeBookings.length, orders: activeOrders.length };
  const emptyCopy = q
    ? { title: 'Nothing matches', text: 'Try another name, or clear the search.' }
    : tab === 'bookings'
      ? {
          title: filter === 'upcoming' ? 'No upcoming bookings' : `No ${filter} bookings`,
          text: 'Book a service from the Home tab and it will show up here.',
        }
      : {
          title: filter === 'upcoming' ? 'No active orders' : `No ${filter} orders`,
          text: 'Order from a store on the Home tab and it will show up here.',
        };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={styles.header}>
        {/* SERVICES-ONLY: was "Bookings & Orders" — restore when orders return */}
        <Text style={styles.title}>Bookings</Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => {
            setSearchOpen((v) => !v);
            setQuery('');
          }}
          accessibilityRole="button"
          accessibilityLabel={searchOpen ? 'Close search' : 'Search'}
        >
          {searchOpen ? (
            <X size={20} color="#0F1E4A" />
          ) : (
            <Search size={20} color="#0F1E4A" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {searchOpen && (
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={
              tab === 'bookings'
                ? 'Search by business or service'
                : 'Search by store, item or order #'
            }
            placeholderTextColor="#94A3B8"
            autoFocus
            returnKeyType="search"
          />
        </View>
      )}

      {/* SERVICES-ONLY: Bookings/Orders switch hidden for launch (Bookings only) — uncomment to restore */}
      {/*
      <View style={styles.segmentBar}>
        {(['bookings', 'orders'] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.seg, active && styles.segActive]}
              activeOpacity={0.85}
              onPress={() => setTab(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.segText, active && styles.segTextActive]}>
                {t === 'bookings' ? 'Bookings' : 'Orders'}
              </Text>
              {counts[t] > 0 && (
                <View style={[styles.segBadge, active && styles.segBadgeActive]}>
                  <Text style={[styles.segBadgeText, active && styles.segBadgeTextActive]}>
                    {counts[t]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      */}

      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filter === f.key && styles.chipActive]}
            onPress={() => setFilter(f.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === f.key }}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#1D4ED8" />
        </View>
      ) : !content ? (
        <View style={styles.center}>
          {tab === 'bookings' ? (
            <CalendarDays size={48} color="#94A3B8" strokeWidth={1.4} />
          ) : (
            <ShoppingBag size={48} color="#94A3B8" strokeWidth={1.4} />
          )}
          <Text style={styles.emptyTitle}>{emptyCopy.title}</Text>
          <Text style={styles.emptyText}>{emptyCopy.text}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
