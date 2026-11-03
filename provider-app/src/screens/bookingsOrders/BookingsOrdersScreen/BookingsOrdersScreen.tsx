import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Command,
  Handbag,
  Search,
  ShoppingBag,
  Wallet,
} from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Color, Spacing } from '@/utils/Theme';
import { INK, PAGE_BG, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useBookingsOrdersScreen } from './useBookingsOrdersScreen';
import { BookingChip, OrderChip } from './types';
import { BookingCard } from './BookingCard';
import { OrderCard } from './OrderCard';
import { TEAL_TINT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BookingsOrdersScreen'>;

/** Bookings chips (with counts); "Cancelled" also counts/filters NO_SHOW. */
const BOOKING_CHIPS: { key: BookingChip; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'New' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

/** Orders chips (with counts); "Cancelled" also counts/filters NO_SHOW. */
const ORDER_CHIPS: { key: OrderChip; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'New' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'READY', label: 'Ready' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function SummaryTile({
  label,
  value,
  theme,
  icon,
}: {
  label: string;
  value: string;
  theme: { colors: string[]; border: string };
  icon: React.ReactNode;
}) {
  return (
    <View style={[styles.tile, { borderColor: theme.border }]}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.tileIcon}>{icon}</View>
      <View style={styles.tileText}>
        <Text style={styles.tileLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text
          style={styles.tileValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function CountChips<K extends string>({
  chips,
  counts,
  active,
  onSelect,
}: {
  chips: { key: K; label: string }[];
  counts: Record<K, number>;
  active: string;
  onSelect: (key: K) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.countChipsScroll}
      contentContainerStyle={styles.countChips}
    >
      {chips.map((c) => {
        const on = active === c.key;
        return (
          <TouchableOpacity
            key={c.key}
            style={[styles.countChip, on && styles.countChipActive]}
            onPress={() => onSelect(c.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Text style={[styles.countChipText, on && styles.countChipTextActive]}>
              {c.label}
            </Text>
            <View style={[styles.countBadge, on && styles.countBadgeActive]}>
              <Text style={[styles.countBadgeText, on && styles.countBadgeTextActive]}>
                {counts[c.key]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Search size={20} color={INK} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Color.placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

export default function BookingsOrdersScreen() {
  const {
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    scoped,
    bookings,
    orders,
    bookingsLoading,
    ordersLoading,
    refreshing,
    refresh,
    actingId,
    setBookingStatus,
    bookingNeedsCollection,
    openCancelBooking,
    openCollectBooking,
    allBookingsCount,
    bookingStats,
    allOrdersCount,
    orderStats,
    search,
    setSearch,
    businessName,
    advanceOrder,
    orderNeedsCollection,
    openCancelOrder,
    openCollectOrder,
    pending,
    reason,
    setReason,
    closeModal,
    submitModal,
  } = useBookingsOrdersScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const loading = tab === 'bookings' ? bookingsLoading : ordersLoading;

  const ordersCountLabel = `${allOrdersCount} order${allOrdersCount === 1 ? '' : 's'}`;

  const ordersView = (
    <ScrollView
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.ordersContent, { paddingBottom: insets.bottom + Spacing.xl }]}
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={refresh} />}
    >
      {allOrdersCount === 0 && !ordersLoading ? (
        <EmptyState
          icon={<CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />}
          title="No orders yet"
        />
      ) : (
        allOrdersCount > 0 && (
          <>
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search by order ID or customer..."
            />

            <CountChips
              chips={ORDER_CHIPS}
              counts={orderStats.counts}
              active={statusFilter}
              onSelect={setStatusFilter}
            />

            <View style={styles.tiles}>
              <SummaryTile
                label="New"
                value={String(orderStats.counts.PENDING)}
                theme={TINT.lavender}
                icon={<Handbag size={24} color={TINT.lavender.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="Ready"
                value={String(orderStats.counts.READY)}
                theme={TINT.mint}
                icon={<ShoppingBag size={24} color={TINT.mint.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="To collect"
                value={formatMoney(orderStats.toCollectMinor, orderStats.currency)}
                theme={TINT.peach}
                icon={<Wallet size={24} color={TINT.peach.icon} strokeWidth={1.8} />}
              />
            </View>

            {orders.length === 0 ? (
              <Text style={styles.noMatch}>No orders match</Text>
            ) : (
              orders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  showBusiness={!scoped}
                  busy={actingId === o.id}
                  needsCollection={orderNeedsCollection(o)}
                  onOpen={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
                  onAdvance={(status) => advanceOrder(o, status)}
                  onCancel={() => openCancelOrder(o)}
                  onCollect={() => openCollectOrder(o)}
                />
              ))
            )}
          </>
        )
      )}
    </ScrollView>
  );

  const bookingsView = (
    <ScrollView
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.ordersContent, { paddingBottom: insets.bottom + Spacing.xl }]}
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={refresh} />}
    >
      {allBookingsCount === 0 && !bookingsLoading ? (
        <EmptyState
          icon={<CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />}
          title="No bookings yet"
        />
      ) : (
        allBookingsCount > 0 && (
          <>
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search by customer or service..."
            />

            <CountChips
              chips={BOOKING_CHIPS}
              counts={bookingStats.counts}
              active={statusFilter}
              onSelect={setStatusFilter}
            />

            <View style={styles.tiles}>
              <SummaryTile
                label="New"
                value={String(bookingStats.counts.PENDING)}
                theme={TINT.lavender}
                icon={<Bell size={24} color={TINT.lavender.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="In progress"
                value={String(bookingStats.counts.IN_PROGRESS)}
                theme={TEAL_TINT}
                icon={<Command size={24} color={TEAL_TINT.icon} strokeWidth={1.8} />}
              />
              <SummaryTile
                label="To collect"
                value={formatMoney(bookingStats.toCollectMinor, bookingStats.currency)}
                theme={TINT.peach}
                icon={<Wallet size={24} color={TINT.peach.icon} strokeWidth={1.8} />}
              />
            </View>

            {bookings.length === 0 ? (
              <Text style={styles.noMatch}>No bookings match</Text>
            ) : (
              bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  showBusiness={!scoped}
                  busy={actingId === b.id}
                  needsCollection={bookingNeedsCollection(b)}
                  onOpen={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
                  onSetStatus={(status) => setBookingStatus(b, status)}
                  onCancel={() => openCancelBooking(b)}
                  onCollect={() => openCollectBooking(b)}
                />
              ))
            )}
          </>
        )
      )}
    </ScrollView>
  );

  const bookingsTodayLabel = `${bookingStats.today} today`;
  const headerTitle = tab === 'orders' ? 'Orders' : 'Bookings';
  const headerCount = tab === 'orders' ? ordersCountLabel : bookingsTodayLabel;

  const isCollect = pending?.kind === 'collectBooking' || pending?.kind === 'collectOrder';

  return (
    <View style={styles.root}>
      {scoped ? (
        <View style={[styles.ordersHeader, { paddingTop: insets.top + Spacing.md }]}>
          <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={BACK_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {headerTitle}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {businessName ? `${businessName}  •  ${headerCount}` : headerCount}
            </Text>
          </View>
        </View>
      ) : (
        <AppHeader variant="light" logo title="Bookings & Orders" />
      )}
      {!scoped && (
        <View style={styles.header}>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, tab === 'bookings' && styles.segmentBtnActive]}
              onPress={() => setTab('bookings')}
            >
              <Text style={[styles.segmentText, tab === 'bookings' && styles.segmentTextActive]}>
                Bookings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, tab === 'orders' && styles.segmentBtnActive]}
              onPress={() => setTab('orders')}
            >
              <Text style={[styles.segmentText, tab === 'orders' && styles.segmentTextActive]}>
                Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {tab === 'orders' ? ordersView : bookingsView}

      <ActionModal
        visible={!!pending}
        title={isCollect ? 'Mark as paid?' : 'Cancel this?'}
        message={
          isCollect
            ? 'This marks the outstanding amount as collected in cash.'
            : 'Let the customer know why, if you want to.'
        }
        reasonValue={isCollect ? undefined : reason}
        onReasonChange={isCollect ? undefined : setReason}
        confirmLabel={isCollect ? 'Mark paid' : 'Confirm cancel'}
        confirmTone={isCollect ? 'default' : 'danger'}
        onConfirm={submitModal}
        onCancel={closeModal}
      />
    </View>
  );
}
