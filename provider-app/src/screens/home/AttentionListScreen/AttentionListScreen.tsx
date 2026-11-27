import React from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CalendarClock, ChevronRight, Coins, TriangleAlert, User } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useAttentionListScreen } from './useAttentionListScreen';
import { AttentionItem } from './types';
import { EMPTY_TINT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AttentionListScreen'>;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const SKELETON_ROWS = [0, 1, 2, 3];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** "Today · 10:30 AM" / "Tomorrow · 9:00 AM" / "Mon, 12 Nov · 4:15 PM". */
function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
  let day = `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  if (diffDays === 0) {
    day = 'Today';
  } else if (diffDays === 1) {
    day = 'Tomorrow';
  } else if (diffDays === -1) {
    day = 'Yesterday';
  }
  const h = d.getHours();
  return `${day} · ${h % 12 || 12}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

export default function AttentionListScreen() {
  const withBottomInset = useBottomInsetStyle();
  const { attention, isLoading, refreshing, refresh } = useAttentionListScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const count = attention.length;
  const subtitle = isLoading ? '' : `${count} ${count === 1 ? 'needs' : 'need'} action`;

  const renderItem = ({ item }: { item: AttentionItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.booking.id })}
    >
      <View style={[styles.iconCircle, item.confirm ? styles.iconConfirm : styles.iconCollect]}>
        {item.confirm ? (
          <CalendarClock size={20} color={PILL.orange.fg} />
        ) : (
          <Coins size={20} color={PILL.green.fg} />
        )}
      </View>
      <View style={styles.main}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.booking.service.name}
        </Text>
        <View style={styles.metaRow}>
          <User size={13} color={Color.textSecondary} />
          <Text style={styles.meta} numberOfLines={1}>
            {item.booking.user.fullName} · {item.booking.provider.businessName}
          </Text>
        </View>
        <Text style={styles.when}>{formatWhen(item.booking.startTime)}</Text>
        <View style={styles.pills}>
          {item.confirm && <Pill label="Confirm request" colors={PILL.orange} />}
          {item.collect && (
            <Pill label={`Collect ${formatMoney(item.due, item.booking.currency)}`} colors={PILL.green} />
          )}
        </View>
      </View>
      <ChevronRight size={18} color={Color.placeholder} />
    </TouchableOpacity>
  );

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
            Needs Your Attention
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
          data={attention}
          keyExtractor={(item) => item.booking.id}
          renderItem={renderItem}
          contentContainerStyle={withBottomInset(styles.listContent)}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <TriangleAlert size={32} color={EMPTY_TINT.fg} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptyBody}>
                Bookings that need confirming or a payment collected will show up here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
