/**
 * Push notifications (Firebase Cloud Messaging), fully guarded.
 *
 * Everything here is a no-op until Firebase is configured natively, i.e. until
 * `android/app/google-services.json` / `ios/DNXProvider/GoogleService-Info.plist` are
 * added (see android/app/build.gradle and ios/DNXProvider/AppDelegate.mm). Without them
 * `firebase.apps` is empty and we never touch the messaging native module (whose
 * Android constants throw when no default Firebase app exists).
 */
import { PermissionsAndroid, Platform } from 'react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { networkCall } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import DEBUG_LOGGER, { WARNING } from '@/utils/DebugLogger';

const FILE = 'push';
const APP = 'provider';

type Messaging = FirebaseMessagingTypes.Module;
type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

/** Data payload the backend attaches to every push. */
export interface PushData {
  notificationId?: string;
  type?: string;
  bookingId?: string;
  orderId?: string;
}

const noop = () => undefined;

/** The messaging instance, or null when Firebase isn't configured/linked. */
export function getMessaging(): Messaging | null {
  try {
    const firebase = require('@react-native-firebase/app').default;
    if (!firebase?.apps?.length) {
      return null;
    }
    const messaging = require('@react-native-firebase/messaging').default;
    return messaging();
  } catch {
    return null;
  }
}

/** iOS: system prompt. Android 13+: POST_NOTIFICATIONS runtime permission. */
async function requestPermission(m: Messaging): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Number(Platform.Version) < 33) {
      return true;
    }
    const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return res === PermissionsAndroid.RESULTS.GRANTED;
  }
  // AuthorizationStatus: -1 NOT_DETERMINED, 0 DENIED, 1 AUTHORIZED, 2 PROVISIONAL, 3 EPHEMERAL.
  const status = await m.requestPermission();
  return status > 0;
}

/** Last FCM token we obtained, so logout can unregister it. */
let currentToken: string | null = null;

async function registerToken(token: string): Promise<void> {
  currentToken = token;
  await networkCall.post(endpoints.devices, {
    token,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    app: APP,
  });
}

/**
 * Asks for permission, registers this device's FCM token with the backend and
 * keeps it registered across token refreshes. Call once the user is logged in;
 * returns a cleanup function.
 */
export function startPushRegistration(): () => void {
  const m = getMessaging();
  if (!m) {
    return noop;
  }
  let active = true;
  (async () => {
    try {
      if (!(await requestPermission(m)) || !active) {
        return;
      }
      const token = await m.getToken();
      if (token && active) {
        await registerToken(token);
      }
    } catch (e) {
      DEBUG_LOGGER(
        `Push registration failed: ${String(e)}`,
        'startPushRegistration',
        FILE,
        '',
        WARNING,
      );
    }
  })();

  let unsubscribe: () => void = noop;
  try {
    unsubscribe = m.onTokenRefresh((token) => {
      if (active) {
        registerToken(token).catch(noop);
      }
    });
  } catch {
    // Messaging unavailable — nothing to listen to.
  }
  return () => {
    active = false;
    unsubscribe();
  };
}

/**
 * Removes this device's token from the backend. Must run BEFORE the auth
 * tokens are cleared (the call is authenticated). Never throws and gives up
 * after a few seconds so logout isn't blocked by a slow network.
 */
export async function unregisterPushToken(): Promise<void> {
  const token = currentToken;
  currentToken = null;
  if (!token) {
    return;
  }
  try {
    await Promise.race([
      networkCall.delete(endpoints.devices, { data: { token } }),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
  } catch {
    // Best effort — the backend also prunes tokens FCM reports as invalid.
  }
}

function toPushData(message: RemoteMessage | null | undefined): PushData | null {
  if (!message?.data) {
    return null;
  }
  const d = message.data as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
  return {
    notificationId: str(d.notificationId),
    type: str(d.type),
    bookingId: str(d.bookingId),
    orderId: str(d.orderId),
  };
}

// getInitialNotification can report the same launch notification again
// (e.g. after logout → login), so only handle it once per app launch.
let initialHandled = false;

/**
 * Foreground messages and notification taps (from background or a cold
 * start). Returns a cleanup function.
 */
export function subscribePushEvents(handlers: {
  onForeground: (data: PushData | null) => void;
  onOpen: (data: PushData) => void;
}): () => void {
  const m = getMessaging();
  if (!m) {
    return noop;
  }
  const subs: Array<() => void> = [];
  try {
    subs.push(m.onMessage((msg) => handlers.onForeground(toPushData(msg))));
    subs.push(
      m.onNotificationOpenedApp((msg) => {
        const data = toPushData(msg);
        if (data) {
          handlers.onOpen(data);
        }
      }),
    );
    if (!initialHandled) {
      initialHandled = true;
      m.getInitialNotification()
        .then((msg) => {
          const data = toPushData(msg);
          if (data) {
            handlers.onOpen(data);
          }
        })
        .catch(noop);
    }
  } catch (e) {
    DEBUG_LOGGER(`Push listeners failed: ${String(e)}`, 'subscribePushEvents', FILE, '', WARNING);
  }
  return () => subs.forEach((unsub) => unsub());
}

/**
 * Registers the headless handler for data messages received while the app is
 * in the background/quit. Must be called from index.js, outside React.
 * Notification messages are displayed by the OS; the in-app list refetches
 * when the app is opened, so there's nothing to do here.
 */
export function registerBackgroundPushHandler(): void {
  try {
    getMessaging()?.setBackgroundMessageHandler(async () => undefined);
  } catch {
    // Firebase not configured — ignore.
  }
}
