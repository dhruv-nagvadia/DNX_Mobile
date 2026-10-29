import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/redux/api/notification/notificationApi';
import { AppNotification } from '@/redux/api/notification/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Data + handlers for the notifications list. */
export function useNotifications() {
  const navigation = useNavigation<Nav>();
  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllNotificationsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Tapping marks the item read and deep-links to the related order/booking.
  const onPress = useCallback(
    (n: AppNotification) => {
      if (!n.isRead) markRead(n.id);
      if (n.entityType === 'ORDER' && n.entityId) {
        navigation.navigate(ROUTES.ORDER_DETAILS, { orderId: n.entityId });
      } else if (n.entityType === 'BOOKING' && n.entityId) {
        navigation.navigate(ROUTES.BOOKING_DETAILS, { bookingId: n.entityId });
      }
    },
    [markRead, navigation],
  );

  const onMarkAll = useCallback(() => {
    if (unreadCount > 0) markAll();
  }, [markAll, unreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    refetch,
    onPress,
    onMarkAll,
  };
}
