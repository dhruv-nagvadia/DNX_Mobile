import React from 'react';
import { FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CalendarClock, ChevronRight, User } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';
import { BookingStatus, DashboardBooking } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useTodaysScheduleScreen } from './useTodaysScheduleScreen';
import { EMPTY_TINT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TodaysScheduleScreen'>;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const SKELETON_ROWS = [0, 1, 2, 3];

const STATUS_PILL: Record<BookingStatus, { label: string; colors: PillColors }> = {
  PENDING: { label: 'Pending', colors: PILL.orange },
  CONFIRMED: { label: 'Confirmed', colors: PILL.blue },
  IN_PROGRESS: { label: 'In progress', colors: PILL.lavender },
  COMPLETED: { label: 'Completed', colors: PILL.green },
  CANCELLED: { label: 'Cancelled', colors: PILL.red },
  NO_SHOW: { label: 'No-show', colors: PILL.red },
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** "10:30" + "AM" for the time block. */
function timeParts(iso: string): { time: string; meridiem: string } {
  const d = new Date(iso);
  const h = d.getHours();
  return { time: `${h % 12 || 12}:${pad2(d.getMinutes())}`, meridiem: h < 12 ? 'AM' : 'PM' };
}

export default function TodaysScheduleScreen() {
  const { todays, isLoading, refreshing, refresh } = useTodaysScheduleScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const count = todays.length;
  const subtitle = isLoading ? '' : `${count} booking${count === 1 ? '' : 's'} today`;

  const renderItem = ({ item: b }: { item: DashboardBooking }) => {
    const { time, meridiem } = timeParts(b.startTime);
    const status = STATUS_PILL[b.status];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
      >
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{time}</Text>
          <Text style={styles.meridiemText}>{meridiem}</Text>
        </View>
        <View style={styles.main}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {b.service.name}
          </Text>
          <View style={styles.metaRow}>
            <User size={13} color={Color.textSecondary} />
            <Text style={styles.meta} numberOfLines={1}>
              {b.user.fullName} · {b.provider.businessName}
            </Text>
          </View>
          {status ? <Pill label={status.label} colors={status.colors} style={styles.pill} /> : null}
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
            Today's Schedule
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
          data={todays}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <CalendarClock size={32} color={EMPTY_TINT.fg} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>No bookings today</Text>
              <Text style={styles.emptyBody}>Today's bookings will show up here as they come in.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
