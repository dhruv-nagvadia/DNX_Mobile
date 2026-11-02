import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShoppingBag, User } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { orderStatusBadge } from '@/utils/status';
import { BusinessOrder, PaymentMethod } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useOpenOrdersScreen } from './useOpenOrdersScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OpenOrdersScreen'>;

function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

function paymentLineFor(o: BusinessOrder): string {
  const due = o.amountMinor - o.amountPaidMinor;
  const labels: Record<PaymentMethod, string> = { CASH: 'COD', ONLINE: 'Online', PARTIAL: 'Partial' };
  return `${labels[o.paymentMethod]}: ${formatMoney(due, o.currency)}`;
}

export default function OpenOrdersScreen() {
  const { openOrders, isLoading, refreshing, refresh } = useOpenOrdersScreen();
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item: o }: { item: BusinessOrder }) => {
    const statusInfo = orderStatusBadge(o.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}>
        <View style={styles.icon}>
          <ShoppingBag size={18} color={Color.primary} />
        </View>
        <View style={styles.main}>
          <Text style={styles.title}>{orderRef(o.id)}</Text>
          <View style={styles.subtitleRow}>
            <User size={11} color={Color.textSecondary} />
            <Text style={styles.subtitle} numberOfLines={1}>
              {o.user.fullName} · {o.provider.businessName}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            {o.items.length} item{o.items.length === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.right}>
          <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
          <Text style={styles.amount}>{paymentLineFor(o)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Orders to Fulfil" />
      <FlatList
        data={openOrders}
        keyExtractor={(o) => o.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<ShoppingBag size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="No open orders"
              body="You're all caught up. New orders will show up here."
            />
          ) : null
        }
      />
    </View>
  );
}
