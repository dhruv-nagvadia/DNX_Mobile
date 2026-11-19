import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/redux/api/notification/notificationApi';
import { AppNotification } from '@/redux/api/notification/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { CATEGORY_LABEL, FilterKey, NotificationCategory, categoryOf, groupByDay } from './helpers';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NotificationsScreen'>;

// SERVICES-ONLY: product businesses disabled for launch — restore the line below and drop the services-only one
// const CATEGORY_ORDER: NotificationCategory[] = ['booking', 'order', 'review', 'payment', 'stock'];
const CATEGORY_ORDER: NotificationCategory[] = ['booking', 'review', 'payment']; // SERVICES-ONLY

/** Ports the customer app's `NotificationsScreen` read/tap flow. There's no
 * per-order/per-booking detail screen yet in provider-mobile, so a tap lands
 * on the Bookings & Orders list (on the matching tab) instead of a specific
 * entity screen. */
export function useNotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const { data: notifications = [], isLoading, isFetching, refetch } = useGetNotificationsQuery();
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: markingAll }] = useMarkAllNotificationsReadMutation();
  const [filter, setFilter] = useState<FilterKey>('all');

  /** "All" + "Unread", then a chip per category actually present in the data. */
  const filters = useMemo(() => {
    const present = new Set(notifications.map(categoryOf));
    const typeChips = CATEGORY_ORDER.filter((c) => present.has(c)).map((c) => ({
      key: c as FilterKey,
      label: CATEGORY_LABEL[c],
    }));
    return [{ key: 'all' as FilterKey, label: 'All' }, { key: 'unread' as FilterKey, label: 'Unread' }, ...typeChips];
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

  const onPressNotification = useCallback(
    (n: AppNotification) => {
      if (!n.isRead) {
        markRead(n.id).unwrap().catch(() => undefined);
      }
      if (n.entityType === 'ORDER') {
        navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' });
      } else if (n.entityType === 'BOOKING') {
        navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' });
      }
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
    markAllRead: () => markAllRead().unwrap().catch(() => undefined),
    onPressNotification,
    goBack: () => navigation.goBack(),
  };
}
