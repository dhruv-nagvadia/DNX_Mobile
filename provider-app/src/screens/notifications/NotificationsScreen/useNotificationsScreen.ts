import { useCallback } from 'react';
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

type Nav = NativeStackNavigationProp<RootStackParamList, 'NotificationsScreen'>;

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

  const onPressNotification = useCallback(
    (n: AppNotification) => {
      if (!n.isRead) markRead(n.id).unwrap().catch(() => undefined);
      if (n.entityType === 'ORDER') {
        navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' });
      } else if (n.entityType === 'BOOKING') {
        navigation.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' });
      }
    },
    [markRead, navigation],
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    markingAll,
    markAllRead: () => markAllRead().unwrap().catch(() => undefined),
    onPressNotification,
  };
}
