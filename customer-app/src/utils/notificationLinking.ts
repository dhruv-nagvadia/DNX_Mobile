import type { NavigationHelpers } from '@react-navigation/native';

import type { AppNotification } from '@/redux/api/notification/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import type { PushData } from './push';

type Navigator = Pick<NavigationHelpers<RootStackParamList>, 'navigate'>;
type NotificationEntity = Pick<AppNotification, 'entityType' | 'entityId'>;

/**
 * Deep-links a notification to its order/booking (or the Reminders list). Shared by the
 * Notifications screen and push-notification taps. Returns false when the
 * notification has no target screen.
 */
export function openNotificationTarget(
  nav: Navigator,
  { entityType, entityId }: NotificationEntity,
): boolean {
  if (entityType === 'ORDER' && entityId) {
    nav.navigate(ROUTES.ORDER_DETAILS, { orderId: entityId });
    return true;
  }
  if (entityType === 'BOOKING' && entityId) {
    nav.navigate(ROUTES.BOOKING_DETAILS, { bookingId: entityId });
    return true;
  }
  if (entityType === 'REMINDER') {
    nav.navigate(ROUTES.REMINDERS);
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
  if (data.reminderId) {
    return { entityType: 'REMINDER', entityId: data.reminderId };
  }
  return { entityType: null, entityId: null };
}
