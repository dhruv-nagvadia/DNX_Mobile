import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import type { AppDispatch } from '@/redux/store';
import { notificationApi } from '@/redux/api/notification/notificationApi';
import { navigationRef } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { PushData, startPushRegistration, subscribePushEvents } from '@/utils/push';
import { entityFromPushData, openNotificationTarget } from '@/utils/notificationLinking';

/** Retries until the NavigationContainer is mounted (cold start), max ~5s. */
function whenNavigationReady(fn: () => void, attempts = 20) {
  if (navigationRef.isReady()) {
    fn();
  } else if (attempts > 0) {
    setTimeout(() => whenNavigationReady(fn, attempts - 1), 250);
  }
}

function refreshNotifications(dispatch: AppDispatch) {
  dispatch(notificationApi.util.invalidateTags(['Notifications', 'UnreadCount']));
}

function openFromPush(data: PushData, dispatch: AppDispatch) {
  if (data.notificationId) {
    dispatch(notificationApi.endpoints.markNotificationRead.initiate(data.notificationId))
      .unwrap()
      .catch(() => undefined);
  } else {
    refreshNotifications(dispatch);
  }
  whenNavigationReady(() => {
    if (!openNotificationTarget(navigationRef, entityFromPushData(data))) {
      navigationRef.navigate(ROUTES.NOTIFICATIONS);
    }
  });
}

/**
 * While logged in: registers the device for push, refreshes the bell/list on
 * foreground messages, and deep-links notification taps. No-op without Firebase.
 */
export function usePushNotifications(isLoggedIn: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const stopRegistration = startPushRegistration();
    const stopEvents = subscribePushEvents({
      onForeground: () => refreshNotifications(dispatch),
      onOpen: (data) => openFromPush(data, dispatch),
    });
    return () => {
      stopRegistration();
      stopEvents();
    };
  }, [isLoggedIn, dispatch]);
}
