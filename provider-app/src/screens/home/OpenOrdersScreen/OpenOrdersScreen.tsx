import React from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, ShoppingBag, User } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { orderStatusBadge } from '@/utils/status';
import { BusinessOrder, OrderStatus } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useOpenOrdersScreen } from './useOpenOrdersScreen';
import { EMPTY_TINT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OpenOrdersScreen'>;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const SKELETON_ROWS = [0, 1, 2, 3];

/** Order-status pill colours — same mapping as the Orders tab's cards. */
const STATUS_PILL: Record<OrderStatus, PillColors> = {
  PENDING: PILL.lavender,
  CONFIRMED: PILL.blue,
  READY: PILL.green,
  COMPLETED: PILL.grey,
  CANCELLED: PILL.grey,
  NO_SHOW: PILL.grey,
};

function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

/** Ports `frontend/src/pages/provider/DashboardPage/DashboardPage.tsx`'s
 * `paymentLine` — an online order shows its payment STATUS ("Paid"/"Online"),
 * not an amount; only cash/partial orders show the outstanding amount due. */
function paymentLineFor(o: BusinessOrder): string {
  if (o.paymentMethod === 'ONLINE') {
    return o.paymentStatus === 'PAID' ? 'Paid' : 'Online';
  }
  const due = o.amountMinor - o.amountPaidMinor;
  const label = o.paymentMethod === 'CASH' ? 'COD' : 'Partial';
  return `${label}: ${formatMoney(due, o.currency)}`;
}

/** Payment pill colour — paid is settled (green), a still-due COD/partial
 * balance needs the provider's attention (orange), a pending online payment
 * is neither (grey). */
function paymentColorsFor(o: BusinessOrder): PillColors {
  if (o.paymentMethod === 'ONLINE') {
    return o.paymentStatus === 'PAID' ? PILL.green : PILL.grey;
  }
  return PILL.orange;
}

export default function OpenOrdersScreen() {
  const withBottomInset = useBottomInsetStyle();
  const { openOrders, isLoading, refreshing, refresh } = useOpenOrdersScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const count = openOrders.length;
  const subtitle = isLoading ? '' : `${count} open order${count === 1 ? '' : 's'}`;

  const renderItem = ({ item: o }: { item: BusinessOrder }) => {
    const statusInfo = orderStatusBadge(o.status);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
      >
        <View style={styles.iconBox}>
          <ShoppingBag size={20} color={PILL.blue.fg} />
        </View>
        <View style={styles.main}>
          <Text style={styles.orderRef}>{orderRef(o.id)}</Text>
          <View style={styles.metaRow}>
            <User size={13} color={Color.textSecondary} />
            <Text style={styles.meta} numberOfLines={1}>
              {o.user.fullName} · {o.provider.businessName}
            </Text>
          </View>
          <Text style={styles.itemsText}>
            {o.items.length} item{o.items.length === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.right}>
          <Pill label={statusInfo.label} colors={STATUS_PILL[o.status]} style={styles.smallPill} />
          <Pill label={paymentLineFor(o)} colors={paymentColorsFor(o)} style={styles.smallPill} />
        </View>
        <ChevronRight size={18} color={Color.placeholder} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={INK} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Orders to Fulfil
          </Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          {SKELETON_ROWS.map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.skelBox} />
              <View style={styles.main}>
                <View style={styles.skelLineLong} />
                <View style={styles.skelLineShort} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={openOrders}
          keyExtractor={(o) => o.id}
          renderItem={renderItem}
          contentContainerStyle={withBottomInset(styles.listContent)}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <ShoppingBag size={32} color={EMPTY_TINT.fg} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>No open orders</Text>
              <Text style={styles.emptyBody}>You're all caught up. New orders will show up here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
