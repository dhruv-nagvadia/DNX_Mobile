import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarClock, User } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Color } from '@/utils/Theme';
import { DashboardBooking } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useTodaysScheduleScreen } from './useTodaysScheduleScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TodaysScheduleScreen'>;

const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });

export default function TodaysScheduleScreen() {
  const { todays, isLoading, refreshing, refresh } = useTodaysScheduleScreen();
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item: b }: { item: DashboardBooking }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
    >
      <View style={styles.timeBadge}>
        <Text style={styles.timeBadgeText}>{timeFmt.format(new Date(b.startTime)).split(' ')[0]}</Text>
        <Text style={styles.timeBadgeMeridiem}>{timeFmt.format(new Date(b.startTime)).split(' ')[1]}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.title}>{b.service.name}</Text>
        <View style={styles.subtitleRow}>
          <User size={11} color={Color.textSecondary} />
          <Text style={styles.subtitle} numberOfLines={1}>
            {b.user.fullName} · {b.provider.businessName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Today's Schedule" />
      <FlatList
        data={todays}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<CalendarClock size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="No bookings today"
              body="Today's bookings will show up here as they come in."
            />
          ) : null
        }
      />
    </View>
  );
}
