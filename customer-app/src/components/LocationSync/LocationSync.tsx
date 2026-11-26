import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLocation } from '@/redux/slices/locationSlice';
import { CustomerLocation, getStoredLocation, saveLocation } from '@/utils/location';
import { refreshGpsLocation, resolveGpsLocation } from '@/utils/locationApi';

// Coming back from the background re-checks GPS at most this often.
const FOREGROUND_REFRESH_MIN_INTERVAL_MS = 2 * 60 * 1000;

function sameLocation(a: CustomerLocation | null, b: CustomerLocation | null): boolean {
  return (
    !!a &&
    !!b &&
    a.mode === b.mode &&
    a.label === b.label &&
    a.lat === b.lat &&
    a.lng === b.lng &&
    a.postalCode === b.postalCode
  );
}

/**
 * Keeps the customer's search location current. Renders nothing; mounted once
 * under Redux.
 *
 * • App opens (a fresh launch): the saved location is shown straight away, then
 *   the customer's CURRENT GPS position is read and — if they are somewhere else —
 *   replaces it (header + every nearby section follow). This applies even over a
 *   city/PIN they picked on an earlier visit: every reopen starts from where they are.
 * • App returns from the background: a GPS-based location is re-checked (at most
 *   every couple of minutes); a location they picked by hand is left alone.
 * • Nothing saved yet: asks for location permission and reads GPS once. If that is
 *   denied or fails, falls back to the postal code/city/state from signup.
 *
 * Refreshing never prompts for permission, and keeps the saved location whenever GPS
 * can't be read.
 */
export function LocationSync(): null {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user.currentUser);
  const location = useAppSelector((s) => s.location.current);
  const locationRef = useRef<CustomerLocation | null>(location);
  locationRef.current = location;
  const lastRefreshRef = useRef(0);
  const launchRefreshDoneRef = useRef(false);

  /** Re-read GPS and, if the customer is somewhere new, make that the location. */
  const refreshFromGps = useCallback(
    async (base: CustomerLocation, opts: { launch: boolean }) => {
      // On resume, only GPS-based locations follow the customer; picked ones stay.
      if (!opts.launch && base.mode !== 'gps') {
        return;
      }
      const now = Date.now();
      if (!opts.launch && now - lastRefreshRef.current < FOREGROUND_REFRESH_MIN_INTERVAL_MS) {
        return;
      }
      lastRefreshRef.current = now;

      const fresh = await refreshGpsLocation(base);
      if (!fresh) {
        return;
      }
      // The customer may have picked another location while we waited — don't override it.
      const latest = locationRef.current;
      if (latest && !sameLocation(latest, base)) {
        return;
      }
      dispatch(setLocation(fresh));
      await saveLocation(fresh);
    },
    [dispatch],
  );

  // Coming back to the app (from background) → check again.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const current = locationRef.current;
      if (state === 'active' && current) {
        refreshFromGps(current, { launch: false });
      }
    });
    return () => sub.remove();
  }, [refreshFromGps]);

  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await getStoredLocation();
      if (!active) {
        return;
      }

      if (stored) {
        // Only seed Redux if nothing is set yet — this effect also re-runs when the
        // user finishes loading, and must not put the old saved location back over a
        // fresher GPS one that arrived in the meantime.
        if (!locationRef.current) {
          dispatch(setLocation(stored));
        }
        // Fresh launch: look at where the customer is NOW (once per launch).
        if (!launchRefreshDoneRef.current) {
          launchRefreshDoneRef.current = true;
          refreshFromGps(stored, { launch: true });
        }
        return;
      }

      // First run (or the customer cleared their location) — ask once.
      const gps = await resolveGpsLocation();
      if (!active) {
        return;
      }
      if (gps) {
        dispatch(setLocation(gps));
        await saveLocation(gps);
        launchRefreshDoneRef.current = true;
        return;
      }

      // Permission denied or GPS/geocoding failed — fall back to the
      // location captured at signup. Not persisted, so GPS is retried
      // (and can take over) the next time the app opens.
      if (currentUser?.postalCode || currentUser?.city || currentUser?.state) {
        const label =
          [currentUser.city, currentUser.state].filter(Boolean).join(', ') ||
          currentUser.postalCode ||
          'Your area';
        dispatch(
          setLocation({
            mode: 'profile',
            label,
            postalCode: currentUser.postalCode ?? undefined,
            city: currentUser.city ?? undefined,
            state: currentUser.state ?? undefined,
          }),
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [dispatch, currentUser, refreshFromGps]);

  return null;
}
