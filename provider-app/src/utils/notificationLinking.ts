import type { NavigationHelpers } from '@react-navigation/native';

import type { AppNotification } from '@/redux/api/notification/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import type { PushData } from './push';

type Navigator = Pick<NavigationHelpers<RootStackParamList>, 'navigate'>;
type NotificationEntity = Pick<AppNotification, 'entityType' | 'entityId'>;

/**
 * Deep-links a notification. Shared by the Notifications screen and
 * push-notification taps. There's no per-order/per-booking detail screen in
 * provider-mobile yet, so this lands on the Bookings & Orders list (on the
 * matching tab). Returns false when the notification has no target screen.
 */
export function openNotificationTarget(
  nav: Navigator,
  { entityType }: NotificationEntity,
): boolean {
  if (entityType === 'ORDER') {
    nav.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'orders' });
    return true;
  }
  if (entityType === 'BOOKING') {
    nav.navigate(ROUTES.BOOKINGS_ORDERS, { tab: 'bookings' });
    return true;
  }
  return false;
}

/** Maps a push payload (`{ orderId?, bookingId? }`) onto the in-app notification shape. */
export function entityFromPushData(data: PushData): NotificationEntity {
  if (data.orderId) {
    return { entityType: 'ORDER', entityId: data.orderId };
  }
  if (data.bookingId) {
    return { entityType: 'BOOKING', entityId: data.bookingId };
  }
  return { entityType: null, entityId: null };
}
