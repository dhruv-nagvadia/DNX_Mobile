/**
 * Push notifications (Firebase Cloud Messaging), fully guarded.
 *
 * Everything here is a no-op until Firebase is configured natively, i.e. until
 * `android/app/google-services.json` / `ios/DNXProvider/GoogleService-Info.plist` are
 * added (see android/app/build.gradle and ios/DNXProvider/AppDelegate.swift). Without them
 * `getApps()` is empty and we never touch the messaging native module (whose
 * Android constants throw when no default Firebase app exists).
 *
 * Uses the modular Firebase API (v22+): functions that take the messaging
 * instance, e.g. `getToken(m)` instead of `m.getToken()`.
 */
import { PermissionsAndroid, Platform } from 'react-native';
import type { Messaging, RemoteMessage } from '@react-native-firebase/messaging';

import { networkCall } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import DEBUG_LOGGER, { WARNING } from '@/utils/DebugLogger';

const FILE = 'push';
const APP = 'provider';

type MessagingModule = typeof import('@react-native-firebase/messaging');

/** Data payload the backend attaches to every push. */
export interface PushData {
  notificationId?: string;
  type?: string;
  bookingId?: string;
  orderId?: string;
}

const noop = () => undefined;

/**
 * The messaging instance plus the modular API functions, or null when Firebase
 * isn't configured/linked. Loaded lazily so a missing native module never
 * crashes app start.
 */
function loadMessaging(): { m: Messaging; api: MessagingModule } | null {
  try {
    const { getApps } = require('@react-native-firebase/app');
    if (!getApps()?.length) {
      return null;
    }
    const api: MessagingModule = require('@react-native-firebase/messaging');
    return { m: api.getMessaging(), api };
  } catch {
    return null;
  }
}

/** iOS: system prompt. Android 13+: POST_NOTIFICATIONS runtime permission. */
async function requestPermission(m: Messaging, api: MessagingModule): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Number(Platform.Version) < 33) {
      return true;
    }
    const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return res === PermissionsAndroid.RESULTS.GRANTED;
  }
  // AuthorizationStatus: -1 NOT_DETERMINED, 0 DENIED, 1 AUTHORIZED, 2 PROVISIONAL, 3 EPHEMERAL.
  const status = await api.requestPermission(m);
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
  const fb = loadMessaging();
  if (!fb) {
    return noop;
  }
  const { m, api } = fb;
  let active = true;
  (async () => {
    try {
      if (!(await requestPermission(m, api)) || !active) {
        return;
      }
      const token = await api.getToken(m);
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
    unsubscribe = api.onTokenRefresh(m, (token) => {
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
      new Promise<void>((resolve) => setTimeout(() => resolve(), 4000)),
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
  const fb = loadMessaging();
  if (!fb) {
    return noop;
  }
  const { m, api } = fb;
  const subs: Array<() => void> = [];
  try {
    subs.push(api.onMessage(m, (msg) => handlers.onForeground(toPushData(msg))));
    subs.push(
      api.onNotificationOpenedApp(m, (msg) => {
        const data = toPushData(msg);
        if (data) {
          handlers.onOpen(data);
        }
      }),
    );
    if (!initialHandled) {
      initialHandled = true;
      api
        .getInitialNotification(m)
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
    const fb = loadMessaging();
    fb?.api.setBackgroundMessageHandler(fb.m, async () => undefined);
  } catch {
    // Firebase not configured — ignore.
  }
}
