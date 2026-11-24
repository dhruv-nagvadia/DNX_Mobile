import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/redux/api/notification/notificationApi';
import { AppNotification } from '@/redux/api/notification/types';
import { RootStackParamList } from '@/navigation/routes';
import { openNotificationTarget } from '@/utils/notificationLinking';

import { CATEGORY_LABEL, FilterKey, NotificationCategory, categoryOf, groupByDay } from './helpers';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ORDER: NotificationCategory[] = [
  // 'booking', // SERVICES-ONLY: bookings are the only main type for now, so the chip just repeats "All" — uncomment when orders are back
  'reminder',
  'order',
  'review',
  'payment',
];

/**
 * Same layout as the provider app's notifications screen (filters, day
 * groups, mark-all-read), but a tap deep-links to the exact order or booking.
 */
export function useNotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll, { isLoading: markingAll }] = useMarkAllNotificationsReadMutation();
  const [filter, setFilter] = useState<FilterKey>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /** "All" + "Unread", then a chip per category actually present in the data. */
  const filters = useMemo(() => {
    const present = new Set(notifications.map(categoryOf));
    const typeChips = CATEGORY_ORDER.filter((c) => present.has(c)).map((c) => ({
      key: c as FilterKey,
      label: CATEGORY_LABEL[c],
    }));
    return [
      { key: 'all' as FilterKey, label: 'All' },
      { key: 'unread' as FilterKey, label: 'Unread' },
      ...typeChips,
    ];
  }, [notifications]);

  const sections = useMemo(() => {
    const visible = notifications.filter((n) => {
      if (filter === 'all') {
        return true;
      }
      if (filter === 'unread') {
        return !n.isRead;
      }
      return categoryOf(n) === filter;
    });
    return groupByDay(visible);
  }, [notifications, filter]);

  // Tapping marks the item read and deep-links to the related order/booking.
  const onPressNotification = useCallback(
    (n: AppNotification) => {
      if (!n.isRead) {
        markRead(n.id)
          .unwrap()
          .catch(() => undefined);
      }
      openNotificationTarget(navigation, n);
    },
    [markRead, navigation],
  );

  return {
    hasAny: notifications.length > 0,
    sections,
    filters,
    filter,
    setFilter,
    unreadCount,
    isLoading,
    refreshing: isFetching && !isLoading,
    refresh: refetch,
    markingAll,
    markAllRead: () => {
      if (unreadCount > 0) {
        markAll()
          .unwrap()
          .catch(() => undefined);
      }
    },
    onPressNotification,
    goBack: () => navigation.goBack(),
  };
}
