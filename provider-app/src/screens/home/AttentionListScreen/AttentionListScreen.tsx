import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarClock, Coins, TriangleAlert, User } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useAttentionListScreen } from './useAttentionListScreen';
import { AttentionItem } from './types';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AttentionListScreen'>;

export default function AttentionListScreen() {
  const { attention, isLoading, refreshing, refresh } = useAttentionListScreen();
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: AttentionItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.booking.id })}
    >
      <View style={[styles.icon, { backgroundColor: item.confirm ? Color.warningSoft : Color.successSoft }]}>
        {item.confirm ? (
          <CalendarClock size={18} color={Color.warning} />
        ) : (
          <Coins size={18} color={Color.success} />
        )}
      </View>
      <View style={styles.main}>
        <Text style={styles.title}>{item.booking.service.name}</Text>
        <View style={styles.subtitleRow}>
          <User size={11} color={Color.textSecondary} />
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.booking.user.fullName} · {item.booking.provider.businessName}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        {item.confirm && (
          <StatusBadge
            label="Confirm Request"
            tone="warning"
            style={styles.compactBadge}
            textStyle={styles.compactBadgeText}
          />
        )}
        {item.collect && (
          <StatusBadge
            label={`Collect ${formatMoney(item.due, item.booking.currency)}`}
            tone="success"
            style={styles.compactBadge}
            textStyle={styles.compactBadgeText}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Needs Your Attention" />
      <FlatList
        data={attention}
        keyExtractor={(item) => item.booking.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<TriangleAlert size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="You're all caught up"
              body="Bookings that need confirming or a payment collected will show up here."
            />
          ) : null
        }
      />
    </View>
  );
}
