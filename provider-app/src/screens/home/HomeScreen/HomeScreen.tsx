import React from 'react';
import { Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  ArrowUp,
  Bell,
  Briefcase,
  Calendar,
  CalendarClock,
  ChevronRight,
  CircleAlert,
  Database,
  Info,
  Package,
  ShoppingBag,
  Tag,
  User,
  Wallet,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { orderStatusBadge } from '@/utils/status';
import { formatAmount } from '@/utils/units';
import { BusinessOrder, OrderStatus } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useHomeScreen } from './useHomeScreen';
import { HERO_GRADIENT, INK, PAGE_BG, PILL, TILE_THEMES, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;
type PillColors = { bg: string; fg: string };

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });
const PREVIEW_LIMIT = 3;

// Money-card bars: last 4 months' collected amounts, scaled to the tallest bar.
const HERO_BAR_MAX = 104;
const HERO_BAR_MIN = 14;

function heroBarHeight(value: number, all: number[]): number {
  const max = Math.max(...all, 0);
  return max > 0 ? Math.max(Math.round((value / max) * HERO_BAR_MAX), HERO_BAR_MIN) : HERO_BAR_MIN;
}

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'DN'
  );
}

/** "10:00 am" → ["10:00", "AM"] for the stacked time box. */
function splitTime(iso: string): [string, string] {
  const [time, meridiem = ''] = timeFmt.format(new Date(iso)).split(/\s+/);
  return [time, meridiem.toUpperCase()];
}

/** A short, readable reference for an order — this app has no sequential
 * order-number field, so the last 6 characters of its id stand in for one. */
function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

/** An online order shows its payment STATUS ("Paid"/"Online"), not an
 * amount; only cash/partial orders show the outstanding amount due. */
function paymentLineFor(o: BusinessOrder): string {
  if (o.paymentMethod === 'ONLINE') {
    return o.paymentStatus === 'PAID' ? 'Paid' : 'Online';
  }
  const due = o.amountMinor - o.amountPaidMinor;
  const label = o.paymentMethod === 'CASH' ? 'COD' : 'Partial';
  return `${label}: ${formatMoney(due, o.currency)}`;
}

/** Mockup colours: New = lavender, Confirmed = blue, Ready = green. */
function orderStatusColors(status: OrderStatus): PillColors {
  switch (status) {
    case 'PENDING':
      return PILL.lavender;
    case 'CONFIRMED':
      return PILL.blue;
    case 'READY':
      return PILL.green;
    default:
      return PILL.grey;
  }
}

function Pill({ label, colors }: { label: string; colors: PillColors }) {
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <Text style={[styles.pillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Title + count on the left, "View All →" on the right, inset divider below. */
function SectionHeader({
  icon,
  title,
  count,
  onViewAll,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  onViewAll?: () => void;
}) {
  return (
    <>
      <View style={styles.sectionHeaderOuter}>
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <Text style={styles.sectionTitle} numberOfLines={1}>
            {title}
            {!!count && ` (${count})`}
          </Text>
        </View>
        {!!onViewAll && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={onViewAll}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color={Color.info} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );
}

function StatTile({
  theme,
  icon,
  label,
  value,
  onPress,
}: {
  theme: (typeof TILE_THEMES)[keyof typeof TILE_THEMES];
  icon: React.ReactNode;
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.statTile, { borderColor: theme.border }]} onPress={onPress} activeOpacity={0.8}>
      <GradientBackground colors={theme.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.statTop}>
        {icon}
        <Text style={styles.statLabel} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <Text style={[styles.statValue, { color: theme.value }]}>{value}</Text>
    </TouchableOpacity>
  );
}

/**
 * Home — matches "Modern Provider Dashboard App Interface.png": light header
 * with avatar + greeting + bell, two quick-link cards, navy money card with
 * bars, four pastel stat tiles, then Today's Schedule / Needs Your Attention /
 * Orders to Fulfil / Low Stock cards. This is the one screen in the app
 * allowed to look like this — every other screen keeps the flat/no-shadow/
 * navy-header convention.
 */
export default function HomeScreen() {
  const {
    currentUser,
    hasBusinesses,
    isLoading,
    refreshing,
    refresh,
    todays,
    upcomingCount,
    attention,
    openOrders,
    openOrdersCount,
    needsActionCount,
    collectedThisMonth,
    monthlyCollected,
    monthTrendPct,
    isNewMonthTrend,
    currency,
    hasStore,
    lowStock,
    activeOffersCount,
    totalOffersCount,
  } = useHomeScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const visibleTodays = todays.slice(0, PREVIEW_LIMIT);
  const visibleAttention = attention.slice(0, PREVIEW_LIMIT);
  const visibleOrders = openOrders.slice(0, PREVIEW_LIMIT);
  const visibleLowStock = lowStock.slice(0, PREVIEW_LIMIT);

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] ?? 'there';
  const trendUp = (monthTrendPct ?? 0) >= 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.statusSpacer, { height: insets.top }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {/* 1. Header — avatar, greeting, bell */}
        <View style={styles.header}>
          {currentUser?.avatarUrl ? (
            <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(currentUser?.fullName ?? 'DNX')}</Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerGreeting} numberOfLines={1}>
              Hello, {firstName} 👋
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              Manage your businesses and bookings
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={22} color={INK} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {!hasBusinesses && !isLoading ? (
          <EmptyState
            icon={<Briefcase size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No businesses yet"
            body="Add your first business to start taking bookings or orders."
            action={
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.BUSINESSES)}>
                <Text style={styles.ctaLink}>Add a business →</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <>
            {/* 2. Quick links */}
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate(ROUTES.EARNINGS)}>
                <View style={styles.quickIcon}>
                  <Wallet size={20} color={Color.primary} />
                </View>
                <View style={styles.quickMain}>
                  <Text style={styles.quickLabel} numberOfLines={1}>
                    Earnings & Payouts
                  </Text>
                  <Text style={styles.quickSubtitle} numberOfLines={1}>
                    View income, payouts
                  </Text>
                </View>
                <ChevronRight size={18} color={INK} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate(ROUTES.ALL_OFFERS)}>
                <View style={styles.quickIcon}>
                  <Tag size={20} color={Color.primary} />
                </View>
                <View style={styles.quickMain}>
                  <Text style={styles.quickLabel} numberOfLines={1}>
                    Offers
                  </Text>
                  <Text style={styles.quickSubtitle} numberOfLines={1}>
                    {totalOffersCount === 0
                      ? 'Create a discount'
                      : `${activeOffersCount} active offer${activeOffersCount === 1 ? '' : 's'}`}
                  </Text>
                </View>
                <ChevronRight size={18} color={INK} />
              </TouchableOpacity>
            </View>

            {/* 3. Money collected this month */}
            <View style={styles.heroCard}>
              <GradientBackground colors={HERO_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
              <View style={styles.heroBars} pointerEvents="none">
                {monthlyCollected.map((v, i) => (
                  <View key={i} style={[styles.heroBar, { height: heroBarHeight(v, monthlyCollected) }]} />
                ))}
              </View>
              <View style={styles.heroLeft}>
                <View style={styles.heroLabelRow}>
                  <Text style={styles.heroLabel} numberOfLines={1}>
                    Money Collected This Month
                  </Text>
                  <Info size={15} color="rgba(248, 250, 252, 0.85)" />
                </View>
                <Text style={styles.heroValue} numberOfLines={1} adjustsFontSizeToFit>
                  {formatMoney(collectedThisMonth, currency)}
                </Text>
                {monthTrendPct !== null && (
                  <View style={styles.heroTrendRow}>
                    <ArrowUp
                      size={15}
                      color={trendUp ? '#4ADE80' : '#F87171'}
                      style={trendUp ? undefined : { transform: [{ rotate: '180deg' }] }}
                    />
                    <Text style={[styles.heroTrendText, !trendUp && styles.heroTrendDown]}>
                      {trendUp ? '+' : ''}
                      {monthTrendPct.toFixed(0)}%
                    </Text>
                    <Text style={styles.heroTrendLabel}>vs. last month</Text>
                  </View>
                )}
                {monthTrendPct === null && isNewMonthTrend && (
                  <View style={styles.heroTrendRow}>
                    <ArrowUp size={15} color="#4ADE80" />
                    <Text style={styles.heroTrendText}>New this month</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 4. Stat tiles */}
            <View style={styles.statGrid}>
              <StatTile
                theme={TILE_THEMES.today}
                icon={<Calendar size={24} color={TILE_THEMES.today.icon} />}
                label="Today's Bookings"
                value={todays.length}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              />
              <StatTile
                theme={TILE_THEMES.upcoming}
                icon={<CalendarClock size={24} color={TILE_THEMES.upcoming.icon} />}
                label="Upcoming"
                value={upcomingCount}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              />
              <StatTile
                theme={TILE_THEMES.orders}
                icon={<Package size={24} color={TILE_THEMES.orders.icon} />}
                label="Open Orders"
                value={openOrdersCount}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' })}
              />
              <StatTile
                theme={TILE_THEMES.action}
                icon={<CircleAlert size={24} color={TILE_THEMES.action.icon} />}
                label="Needs Action"
                value={needsActionCount}
                onPress={() => navigation.navigate(ROUTES.ATTENTION_LIST)}
              />
            </View>

            {/* 5. Today's schedule */}
            <View style={styles.card}>
              <SectionHeader
                icon={<Calendar size={22} color={Color.primary} />}
                title="Today's Schedule"
                count={todays.length}
                onViewAll={todays.length > 0 ? () => navigation.navigate(ROUTES.TODAYS_SCHEDULE) : undefined}
              />
              {todays.length === 0 ? (
                <Text style={styles.emptyText}>No bookings today.</Text>
              ) : (
                visibleTodays.map((b, i) => {
                  const [time, meridiem] = splitTime(b.startTime);
                  return (
                    <React.Fragment key={b.id}>
                      {i > 0 && <View style={styles.divider} />}
                      <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
                      >
                        <View style={styles.timeBox}>
                          <Text style={styles.timeBoxText}>{time}</Text>
                          <Text style={styles.timeBoxText}>{meridiem}</Text>
                        </View>
                        <View style={styles.rowMain}>
                          <Text style={styles.rowTitle} numberOfLines={1}>
                            {b.service.name}
                          </Text>
                          <View style={styles.rowSubtitleRow}>
                            <User size={14} color={Color.textSecondary} />
                            <Text style={styles.rowSubtitle} numberOfLines={1}>
                              {b.user.fullName} • {b.provider.businessName}
                            </Text>
                          </View>
                        </View>
                        <ChevronRight size={20} color={INK} />
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })
              )}
            </View>

            {/* 6. Needs your attention */}
            <View style={styles.card}>
              <SectionHeader
                icon={<CircleAlert size={22} color={Color.error} />}
                title="Needs Your Attention"
                count={attention.length}
                onViewAll={attention.length > 0 ? () => navigation.navigate(ROUTES.ATTENTION_LIST) : undefined}
              />
              {attention.length === 0 ? (
                <Text style={styles.emptyText}>You're all caught up.</Text>
              ) : (
                visibleAttention.map((item, i) => (
                  <React.Fragment key={item.booking.id}>
                    {i > 0 && <View style={styles.divider} />}
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.booking.id })}
                    >
                      <View style={[styles.rowIcon, item.confirm ? styles.confirmIconBox : styles.collectIconBox]}>
                        {item.confirm ? (
                          <Calendar size={20} color="#4F46E5" />
                        ) : (
                          <Database size={20} color="#A16207" />
                        )}
                      </View>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle} numberOfLines={1}>
                          {item.booking.service.name}
                        </Text>
                        <View style={styles.rowSubtitleRow}>
                          <User size={14} color={Color.textSecondary} />
                          <Text style={styles.rowSubtitle} numberOfLines={1}>
                            {item.booking.user.fullName} • {item.booking.provider.businessName}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.rowRight}>
                        {item.confirm && <Pill label="Confirm Request" colors={PILL.orange} />}
                        {item.collect && <Pill label="Collect Payment" colors={PILL.green} />}
                        {item.collect && (
                          <Text style={styles.rowAmount}>{formatMoney(item.due, item.booking.currency)}</Text>
                        )}
                      </View>
                      <ChevronRight size={20} color={INK} />
                    </TouchableOpacity>
                  </React.Fragment>
                ))
              )}
            </View>

            {/* 7. Orders to fulfil */}
            <View style={styles.card}>
              <SectionHeader
                icon={<Package size={22} color="#D97706" />}
                title="Orders to Fulfil"
                count={openOrders.length}
                onViewAll={openOrders.length > 0 ? () => navigation.navigate(ROUTES.OPEN_ORDERS) : undefined}
              />
              {openOrders.length === 0 ? (
                <Text style={styles.emptyText}>No open orders. You're all caught up.</Text>
              ) : (
                visibleOrders.map((o, i) => {
                  const statusInfo = orderStatusBadge(o.status);
                  const paid = o.paymentStatus === 'PAID';
                  return (
                    <React.Fragment key={o.id}>
                      {i > 0 && <View style={styles.divider} />}
                      <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
                      >
                        <View style={[styles.rowIcon, { backgroundColor: PILL.grey.bg }]}>
                          <ShoppingBag size={20} color={INK} />
                        </View>
                        <View style={styles.rowMain}>
                          <Text style={styles.rowTitle}>{orderRef(o.id)}</Text>
                          <View style={styles.rowSubtitleRow}>
                            <User size={14} color={Color.textSecondary} />
                            <Text style={styles.rowSubtitle} numberOfLines={1}>
                              {o.user.fullName} • {o.provider.businessName}
                            </Text>
                          </View>
                          <Text style={styles.rowSubtitle}>
                            {o.items.length} item{o.items.length === 1 ? '' : 's'}
                          </Text>
                        </View>
                        <View style={styles.rowRight}>
                          <Pill label={statusInfo.label} colors={orderStatusColors(o.status)} />
                          <Pill label={paymentLineFor(o)} colors={paid ? PILL.green : PILL.grey} />
                        </View>
                        <ChevronRight size={20} color={INK} />
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })
              )}
            </View>

            {/* 8. Low stock */}
            {hasStore && lowStock.length > 0 && (
              <View style={styles.card}>
                <SectionHeader
                  icon={<Package size={22} color="#D97706" />}
                  title="Low Stock"
                  count={lowStock.length}
                  onViewAll={() => navigation.navigate(ROUTES.LOW_STOCK_LIST)}
                />
                {visibleLowStock.map((item, i) => (
                  <React.Fragment key={item.product.id}>
                    {i > 0 && <View style={styles.divider} />}
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => navigation.navigate(ROUTES.STOCK, { businessId: item.businessId })}
                    >
                      <View style={[styles.rowIcon, { backgroundColor: PILL.grey.bg }]}>
                        {item.product.imageUrl ? (
                          <Image source={{ uri: item.product.imageUrl }} style={styles.rowThumb} />
                        ) : (
                          <Package size={20} color={Color.textSecondary} />
                        )}
                      </View>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle} numberOfLines={1}>
                          {item.product.name}
                        </Text>
                        <Text style={styles.rowSubtitle} numberOfLines={1}>
                          {item.businessName}
                        </Text>
                      </View>
                      <Pill
                        label={
                          item.level === 'out'
                            ? 'Out of stock'
                            : `Only ${formatAmount(item.product.stockQty, item.product.measure)} left`
                        }
                        colors={PILL.red}
                      />
                      <ChevronRight size={20} color={INK} />
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
