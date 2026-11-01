import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  Briefcase,
  CalendarCheck,
  ChevronRight,
  Clock,
  PackageCheck,
  PackageSearch,
  TriangleAlert,
  Wallet,
} from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { orderNeedsCollection, orderStatusBadge } from '@/utils/status';
import { stockLabel } from '@/utils/units';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useHomeScreen } from './useHomeScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });
const PREVIEW_LIMIT = 3;

/** The title/count/"view all" row sits above the card, not inside it. */
function SectionHeader({
  title,
  count,
  onViewAll,
  expanded,
}: {
  title: string;
  count?: number;
  onViewAll?: () => void;
  expanded?: boolean;
}) {
  return (
    <View style={styles.sectionHeaderOuter}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!count && (
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{count}</Text>
          </View>
        )}
      </View>
      {!!onViewAll && (
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={onViewAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.viewAllText}>{expanded ? 'Show less' : 'View all'}</Text>
          <ChevronRight
            size={16}
            color={Color.primary}
            style={expanded ? styles.chevronExpanded : undefined}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Home — a real mobile dashboard: icon-badged, elevated stat cards (not the
 * web admin's flat bordered tiles), a quick-actions row to Businesses and
 * Earnings (since they're no longer their own bottom tabs), then today's
 * schedule and what needs attention. Same underlying numbers as the web
 * `DashboardPage`, aggregated across every business.
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
    currency,
    hasStore,
    lowStock,
  } = useHomeScreen();
  const navigation = useNavigation<Nav>();

  const [showAllAttention, setShowAllAttention] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllLowStock, setShowAllLowStock] = useState(false);

  const visibleAttention = showAllAttention ? attention : attention.slice(0, PREVIEW_LIMIT);
  const visibleOrders = showAllOrders ? openOrders : openOrders.slice(0, PREVIEW_LIMIT);
  const visibleLowStock = showAllLowStock ? lowStock : lowStock.slice(0, PREVIEW_LIMIT);

  return (
    <View style={styles.root}>
      <AppHeader
        logo
        title={currentUser?.fullName ?? 'DNX Provider'}
        right={
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
            accessibilityRole="button"
          >
            <Bell size={18} color={Color.white} />
          </TouchableOpacity>
        }
      />
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
                <View style={[styles.quickIcon, { backgroundColor: Color.primarySoft }]}>
                  <Briefcase size={20} color={Color.primary} />
                </View>
                <Text style={styles.quickLabel}>Businesses</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate(ROUTES.EARNINGS)}>
                <View style={[styles.quickIcon, { backgroundColor: Color.successSoft }]}>
                  <Wallet size={20} color={Color.success} />
                </View>
                <Text style={styles.quickLabel}>Earnings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statGrid}>
              <View style={[styles.statTile, styles.statTileWide]}>
                <View style={[styles.statIcon, { backgroundColor: Color.successSoft }]}>
                  <Wallet size={18} color={Color.success} />
                </View>
                <Text style={styles.statValue}>{formatMoney(collectedThisMonth, currency)}</Text>
                <Text style={styles.statLabel}>Collected this month</Text>
              </View>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={[styles.statIcon, { backgroundColor: Color.primarySoft }]}>
                  <CalendarCheck size={18} color={Color.primary} />
                </View>
                <Text style={styles.statValue}>{todays.length}</Text>
                <Text style={styles.statLabel}>Today's bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={[styles.statIcon, { backgroundColor: Color.accentSoft }]}>
                  <Clock size={18} color={Color.accent2} />
                </View>
                <Text style={styles.statValue}>{upcomingCount}</Text>
                <Text style={styles.statLabel}>Upcoming</Text>
                <Text style={styles.statHint}>confirmed & pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' })}
              >
                <View style={[styles.statIcon, { backgroundColor: Color.warningSoft }]}>
                  <PackageCheck size={18} color={Color.warning} />
                </View>
                <Text style={styles.statValue}>{openOrdersCount}</Text>
                <Text style={styles.statLabel}>Open orders</Text>
                <Text style={styles.statHint}>to fulfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <View style={[styles.statIcon, { backgroundColor: Color.errorSoft }]}>
                  <TriangleAlert size={18} color={Color.error} />
                </View>
                <Text style={styles.statValue}>{needsActionCount}</Text>
                <Text style={styles.statLabel}>Needs action</Text>
                <Text style={styles.statHint}>to confirm or collect</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionGroup}>
              <SectionHeader title="Today's schedule" count={todays.length} />
              <View style={styles.section}>
                {todays.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No bookings today.</Text>
                  </View>
                ) : (
                  todays.map((b) => (
                    <TouchableOpacity
                      key={b.id}
                      style={styles.row}
                      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
                    >
                      <View style={[styles.rowIcon, { backgroundColor: Color.primarySoft }]}>
                        <CalendarCheck size={16} color={Color.primary} />
                      </View>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle}>{b.service.name}</Text>
                        <Text style={styles.rowSubtitle}>
                          {b.user.fullName} · {b.provider.businessName}
                        </Text>
                      </View>
                      <Text style={styles.rowTime}>{timeFmt.format(new Date(b.startTime))}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

            <View style={styles.sectionGroup}>
              <SectionHeader
                title="Needs your attention"
                count={attention.length}
                onViewAll={attention.length > PREVIEW_LIMIT ? () => setShowAllAttention((v) => !v) : undefined}
                expanded={showAllAttention}
              />
              <View style={styles.section}>
                {attention.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>You're all caught up.</Text>
                  </View>
                ) : (
                  visibleAttention.map((item) => (
                    <TouchableOpacity
                      key={item.booking.id}
                      style={styles.row}
                      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.booking.id })}
                    >
                      <View
                        style={[
                          styles.rowIcon,
                          { backgroundColor: item.confirm ? Color.warningSoft : Color.successSoft },
                        ]}
                      >
                        {item.confirm ? (
                          <Clock size={16} color={Color.warning} />
                        ) : (
                          <Wallet size={16} color={Color.success} />
                        )}
                      </View>
                      <View style={styles.rowMain}>
                        <Text style={styles.rowTitle}>{item.booking.service.name}</Text>
                        <Text style={styles.rowSubtitle}>
                          {item.booking.user.fullName} · {item.booking.provider.businessName}
                        </Text>
                      </View>
                      <StatusBadge
                        label={item.confirm ? 'Confirm' : `Collect ${formatMoney(item.due, item.booking.currency)}`}
                        tone={item.confirm ? 'warning' : 'success'}
                        cutRight
                        style={styles.edgeBadge}
                      />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

            <View style={styles.sectionGroup}>
              <SectionHeader
                title="Orders to fulfil"
                count={openOrders.length}
                onViewAll={openOrders.length > PREVIEW_LIMIT ? () => setShowAllOrders((v) => !v) : undefined}
                expanded={showAllOrders}
              />
              <View style={styles.section}>
                {openOrders.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No open orders. You're all caught up.</Text>
                  </View>
                ) : (
                  visibleOrders.map((o) => {
                    const statusInfo = orderStatusBadge(o.status);
                    return (
                      <TouchableOpacity
                        key={o.id}
                        style={styles.row}
                        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
                      >
                        <View style={[styles.rowIcon, { backgroundColor: Color.warningSoft }]}>
                          <PackageCheck size={16} color={Color.warning} />
                        </View>
                        <View style={styles.rowMain}>
                          <Text style={styles.rowTitle} numberOfLines={1}>
                            {o.user.fullName}
                          </Text>
                          <Text style={styles.rowSubtitle} numberOfLines={1}>
                            {o.provider.businessName} · {o.items.length} item{o.items.length === 1 ? '' : 's'}
                          </Text>
                        </View>
                        <View style={styles.orderRowRight}>
                          <StatusBadge label={statusInfo.label} tone={statusInfo.tone} cutRight style={styles.edgeBadge} />
                          {orderNeedsCollection(o) && (
                            <Text style={styles.collectText}>
                              Collect {formatMoney(o.amountMinor - (o.amountPaidMinor ?? 0), o.currency)}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </View>

            {hasStore && lowStock.length > 0 && (
              <View style={styles.sectionGroup}>
                <SectionHeader
                  title="Low stock"
                  count={lowStock.length}
                  onViewAll={lowStock.length > PREVIEW_LIMIT ? () => setShowAllLowStock((v) => !v) : undefined}
                  expanded={showAllLowStock}
                />
                <View style={styles.section}>
                  {visibleLowStock.map((item) => (
                    <TouchableOpacity
                      key={item.product.id}
                      style={styles.row}
                      onPress={() => navigation.navigate(ROUTES.STOCK, { businessId: item.businessId })}
                    >
                      <View
                        style={[
                          styles.rowIcon,
                          { backgroundColor: item.level === 'out' ? Color.errorSoft : Color.warningSoft },
                        ]}
                      >
                        <PackageSearch size={16} color={item.level === 'out' ? Color.error : Color.warning} />
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
                        label={item.level === 'out' ? 'Out of stock' : 'Low'}
                        tone={item.level === 'out' ? 'error' : 'warning'}
                        cutRight
                        style={styles.edgeBadge}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
