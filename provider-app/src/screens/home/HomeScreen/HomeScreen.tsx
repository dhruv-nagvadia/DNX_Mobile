import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { formatMoney } from '@/utils/money';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useHomeScreen } from './useHomeScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });

/**
 * Home / Dashboard — mirrors the web `DashboardPage`'s five stat tiles
 * (Today's bookings, Upcoming, Open orders, Needs action, Collected this
 * month), all aggregated across every one of the provider's businesses, same
 * as the web dashboard (there's no per-business filter on this screen there
 * either).
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
    openOrdersCount,
    needsActionCount,
    collectedThisMonth,
    currency,
  } = useHomeScreen();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {currentUser?.fullName ?? 'there'}</Text>
          <Text style={styles.businessCount}>Here's how your business is doing today.</Text>
        </View>

        {!hasBusinesses && !isLoading ? (
          <View style={styles.emptyBusinesses}>
            <Text style={styles.sectionTitle}>No businesses yet</Text>
            <Text style={styles.emptyText}>
              Businesses you add on the web dashboard will show up here automatically.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statGrid}>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <Text style={styles.statValue}>{todays.length}</Text>
                <Text style={styles.statLabel}>Today's bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <Text style={styles.statValue}>{upcomingCount}</Text>
                <Text style={styles.statLabel}>Upcoming</Text>
                <Text style={styles.statHint}>confirmed & pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' })}
              >
                <Text style={styles.statValue}>{openOrdersCount}</Text>
                <Text style={styles.statLabel}>Open orders</Text>
                <Text style={styles.statHint}>to fulfil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' })}
              >
                <Text style={styles.statValue}>{needsActionCount}</Text>
                <Text style={styles.statLabel}>Needs action</Text>
                <Text style={styles.statHint}>to confirm or collect</Text>
              </TouchableOpacity>
              <View style={[styles.statTile, styles.statTileWide]}>
                <Text style={styles.statValue}>{formatMoney(collectedThisMonth, currency)}</Text>
                <Text style={styles.statLabel}>Collected this month</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's schedule</Text>
              {todays.length === 0 ? (
                <Text style={styles.emptyText}>No bookings today.</Text>
              ) : (
                todays.map((b, i) => (
                  <View key={b.id} style={[styles.row, i === 0 && styles.rowFirst]}>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle}>{b.service.name}</Text>
                      <Text style={styles.rowSubtitle}>
                        {b.user.fullName} · {b.provider.businessName}
                      </Text>
                    </View>
                    <Text style={styles.rowSubtitle}>{timeFmt.format(new Date(b.startTime))}</Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Needs your attention</Text>
              {attention.length === 0 ? (
                <Text style={styles.emptyText}>You're all caught up.</Text>
              ) : (
                attention.map((item, i) => (
                  <View key={item.booking.id} style={[styles.row, i === 0 && styles.rowFirst]}>
                    <View style={styles.rowMain}>
                      <Text style={styles.rowTitle}>{item.booking.service.name}</Text>
                      <Text style={styles.rowSubtitle}>
                        {item.booking.user.fullName} · {item.booking.provider.businessName}
                      </Text>
                    </View>
                    <View style={styles.rowBadge}>
                      <Text style={styles.rowBadgeText}>
                        {item.confirm ? 'Confirm' : `Collect ${formatMoney(item.due, item.booking.currency)}`}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
