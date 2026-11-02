import React from 'react';
import { Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Briefcase,
  CalendarClock,
  ChevronRight,
  Coins,
  FlaskConical,
  Info,
  ShoppingBag,
  TrendingUp,
  TriangleAlert,
  User,
  Wallet,
} from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { GradientBackground } from '@/components/GradientBackground';
import { MiniBarChart } from '@/components/MiniBarChart';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { orderStatusBadge } from '@/utils/status';
import { stockLabel } from '@/utils/units';
import { BusinessOrder, PaymentMethod } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useHomeScreen } from './useHomeScreen';
import { HERO_GRADIENT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });
const PREVIEW_LIMIT = 3;

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

/** A short, readable reference for an order — this app has no sequential
 * order-number field, so the last 6 characters of its id stand in for one. */
function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

function paymentLineFor(o: BusinessOrder): string {
  const due = o.amountMinor - o.amountPaidMinor;
  const labels: Record<PaymentMethod, string> = { CASH: 'COD', ONLINE: 'Online', PARTIAL: 'Partial' };
  return `${labels[o.paymentMethod]}: ${formatMoney(due, o.currency)}`;
}

/** The title/count/"view all" row sits inside the card, above its rows. */
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
    <View style={styles.sectionHeaderOuter}>
      <View style={styles.sectionHeaderLeft}>
        {icon}
        <Text style={styles.sectionTitle}>
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
          <ChevronRight size={14} color={Color.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Purely decorative — a fixed ascending staircase, not real per-period
// revenue data (matches the mockup's look and the web dashboard's bars).
const CHART_BARS = [30, 55, 75, 100];

/**
 * Home — restyled to match a reference mockup the user commissioned
 * separately (light header with greeting + avatar, soft-shadowed rounded
 * cards, pastel-tinted stat tiles, a revenue hero with a trend line + mini
 * chart). This is the one screen in the app allowed to look like this —
 * every other screen keeps the flat/no-shadow/navy-header convention.
 */
export default function HomeScreen() {
  const {
    currentUser,
    hasBusinesses,
    businesses,
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
    monthTrendPct,
    isNewMonthTrend,
    currency,
    hasStore,
    lowStock,
  } = useHomeScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const visibleTodays = todays.slice(0, PREVIEW_LIMIT);
  const visibleAttention = attention.slice(0, PREVIEW_LIMIT);
  const visibleOrders = openOrders.slice(0, PREVIEW_LIMIT);
  const visibleLowStock = lowStock.slice(0, PREVIEW_LIMIT);

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] ?? 'there';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Color.primary} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {currentUser?.avatarUrl ? (
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(currentUser?.fullName ?? 'DNX')}</Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.headerGreeting} numberOfLines={1}>
            Hello, {firstName}
          </Text>
          <Text style={styles.headerSubtitle}>Manage your businesses and bookings</Text>
        </View>
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
          accessibilityRole="button"
        >
          <Bell size={18} color={Color.white} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
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
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate(ROUTES.BUSINESSES)}>
                <View style={[styles.quickIcon, { backgroundColor: Color.accentSoft }]}>
                  <Briefcase size={18} color={Color.accent2} />
                </View>
                <View style={styles.quickMain}>
                  <Text style={styles.quickLabel} numberOfLines={1}>
                    Businesses
                  </Text>
                  <Text style={styles.quickSubtitle} numberOfLines={1}>
                    {businesses.length} Business{businesses.length === 1 ? '' : 'es'}
                  </Text>
                </View>
                <ChevronRight size={16} color={Color.placeholder} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate(ROUTES.EARNINGS)}>
                <View style={[styles.quickIcon, { backgroundColor: Color.primarySoft }]}>
                  <Wallet size={18} color={Color.primary} />
                </View>
                <View style={styles.quickMain}>
                  <Text style={styles.quickLabel} numberOfLines={1}>
                    Earnings
                  </Text>
                  <Text style={styles.quickSubtitle} numberOfLines={1}>
                    View income, payouts
                  </Text>
                </View>
                <ChevronRight size={16} color={Color.placeholder} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroCard}>
              <GradientBackground colors={HERO_GRADIENT} />
              <View style={styles.heroTop}>
                <Text style={styles.heroLabel}>Money Collected This Month</Text>
                <Info size={14} color={Color.onDarkMuted} />
              </View>
              <View style={styles.heroBody}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroValue} numberOfLines={1}>
                    {formatMoney(collectedThisMonth, currency)}
                  </Text>
                  {monthTrendPct !== null && (
                    <View style={styles.heroTrendRow}>
                      <TrendingUp size={13} color="#4ADE80" />
                      <Text style={styles.heroTrendText}>
                        {monthTrendPct >= 0 ? '+' : ''}
                        {monthTrendPct.toFixed(0)}%
                      </Text>
                      <Text style={styles.heroTrendLabel}>vs last month</Text>
                    </View>
                  )}
                  {monthTrendPct === null && isNewMonthTrend && (
                    <View style={styles.heroTrendRow}>
                      <TrendingUp size={13} color="#4ADE80" />
                      <Text style={styles.heroTrendText}>New this month</Text>
                    </View>
                  )}
                </View>
                <MiniBarChart values={CHART_BARS} height={44} />
              </View>
            </View>

            <View style={styles.statGrid}>
              <TouchableOpacity
                style={[styles.statTile, { backgroundColor: Color.primarySoft }]}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={styles.statIcon}>
                  <CalendarClock size={24} color={Color.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.statLabel}>Today's Bookings</Text>
                <Text style={styles.statValue}>{todays.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statTile, { backgroundColor: Color.specialSoft }]}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={styles.statIcon}>
                  <CalendarClock size={24} color={Color.special} strokeWidth={2.5} />
                </View>
                <Text style={styles.statLabel}>Upcoming</Text>
                <Text style={styles.statValue}>{upcomingCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statTile, { backgroundColor: Color.warningSoft }]}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' })}
              >
                <View style={styles.statIcon}>
                  <ShoppingBag size={24} color={Color.warning} strokeWidth={2.5} />
                </View>
                <Text style={styles.statLabel}>Open Orders</Text>
                <Text style={styles.statValue}>{openOrdersCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statTile, { backgroundColor: Color.errorSoft }]}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={styles.statIcon}>
                  <TriangleAlert size={24} color={Color.error} strokeWidth={2.5} />
                </View>
                <Text style={styles.statLabel}>Needs Action</Text>
                <Text style={styles.statValue}>{needsActionCount}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <SectionHeader
                icon={<CalendarClock size={16} color={Color.primary} />}
                title="Today's Schedule"
                count={todays.length}
                onViewAll={
                  todays.length > PREVIEW_LIMIT ? () => navigation.navigate(ROUTES.TODAYS_SCHEDULE) : undefined
                }
              />
              {todays.length === 0 ? (
                <Text style={styles.emptyText}>No bookings today.</Text>
              ) : (
                visibleTodays.map((b, i) => (
                  <TouchableOpacity
                    key={b.id}
                    style={[styles.row, i === 0 && styles.rowFirst]}
                    onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
                  >
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>{timeFmt.format(new Date(b.startTime)).split(' ')[0]}</Text>
                      <Text style={styles.timeBadgeMeridiem}>
                        {timeFmt.format(new Date(b.startTime)).split(' ')[1]}
                      </Text>
                    </View>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle}>{b.service.name}</Text>
                      <View style={styles.rowSubtitleRow}>
                        <User size={11} color={Color.textSecondary} />
                        <Text style={styles.rowSubtitle} numberOfLines={1}>
                          {b.user.fullName} · {b.provider.businessName}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={16} color={Color.placeholder} />
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View style={styles.card}>
              <SectionHeader
                icon={<TriangleAlert size={16} color={Color.error} />}
                title="Needs Your Attention"
                count={attention.length}
                onViewAll={
                  attention.length > PREVIEW_LIMIT ? () => navigation.navigate(ROUTES.ATTENTION_LIST) : undefined
                }
              />
              {attention.length === 0 ? (
                <Text style={styles.emptyText}>You're all caught up.</Text>
              ) : (
                visibleAttention.map((item, i) => (
                  <TouchableOpacity
                    key={item.booking.id}
                    style={[styles.row, i === 0 && styles.rowFirst]}
                    onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.booking.id })}
                  >
                    <View
                      style={[
                        styles.rowIcon,
                        { backgroundColor: item.confirm ? Color.warningSoft : Color.successSoft },
                      ]}
                    >
                      {item.confirm ? (
                        <CalendarClock size={16} color={Color.warning} />
                      ) : (
                        <Coins size={16} color={Color.success} />
                      )}
                    </View>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle}>{item.booking.service.name}</Text>
                      <View style={styles.rowSubtitleRow}>
                        <User size={11} color={Color.textSecondary} />
                        <Text style={styles.rowSubtitle} numberOfLines={1}>
                          {item.booking.user.fullName} · {item.booking.provider.businessName}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowRight}>
                      <StatusBadge
                        label={item.confirm ? 'Confirm Request' : 'Collect Payment'}
                        tone={item.confirm ? 'warning' : 'success'}
                      />
                      {!item.confirm && (
                        <Text style={styles.rowAmount}>{formatMoney(item.due, item.booking.currency)}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View style={styles.card}>
              <SectionHeader
                icon={<ShoppingBag size={16} color={Color.warning} />}
                title="Orders to Fulfil"
                count={openOrders.length}
                onViewAll={
                  openOrders.length > PREVIEW_LIMIT ? () => navigation.navigate(ROUTES.OPEN_ORDERS) : undefined
                }
              />
              {openOrders.length === 0 ? (
                <Text style={styles.emptyText}>No open orders. You're all caught up.</Text>
              ) : (
                visibleOrders.map((o, i) => {
                  const statusInfo = orderStatusBadge(o.status);
                  return (
                    <TouchableOpacity
                      key={o.id}
                      style={[styles.row, i === 0 && styles.rowFirst]}
                      onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
                    >
                      <View style={[styles.rowIcon, { backgroundColor: Color.primarySoft }]}>
                        <ShoppingBag size={16} color={Color.primary} />
                      </View>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle}>{orderRef(o.id)}</Text>
                        <View style={styles.rowSubtitleRow}>
                          <User size={11} color={Color.textSecondary} />
                          <Text style={styles.rowSubtitle} numberOfLines={1}>
                            {o.user.fullName} · {o.provider.businessName}
                          </Text>
                        </View>
                        <Text style={styles.rowSubtitle}>
                          {o.items.length} item{o.items.length === 1 ? '' : 's'}
                        </Text>
                      </View>
                      <View style={styles.rowRight}>
                        <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
                        <Text style={styles.rowAmount}>{paymentLineFor(o)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {hasStore && lowStock.length > 0 && (
              <View style={styles.card}>
                <SectionHeader
                  icon={<FlaskConical size={16} color={Color.error} />}
                  title="Low Stock"
                  count={lowStock.length}
                  onViewAll={
                    lowStock.length > PREVIEW_LIMIT ? () => navigation.navigate(ROUTES.LOW_STOCK_LIST) : undefined
                  }
                />
                {visibleLowStock.map((item, i) => (
                  <TouchableOpacity
                    key={item.product.id}
                    style={[styles.row, i === 0 && styles.rowFirst]}
                    onPress={() => navigation.navigate(ROUTES.STOCK, { businessId: item.businessId })}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: Color.divider }]}>
                      <FlaskConical size={16} color={Color.textSecondary} />
                    </View>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.rowSubtitle} numberOfLines={1}>
                        {item.businessName} · {stockLabel(item.product.stockQty, item.product.measure)}
                      </Text>
                    </View>
                    <StatusBadge
                      label={item.level === 'out' ? 'Out of Stock' : `Only ${item.product.stockQty} left`}
                      tone="error"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
