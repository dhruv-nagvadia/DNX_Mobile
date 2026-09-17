import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLocation } from '@/redux/slices/locationSlice';
import { getStoredLocation, saveLocation } from '@/utils/location';
import { resolveGpsLocation } from '@/utils/locationApi';

/**
 * Loads the customer's saved search location (GPS or manual city/PIN) from
 * on-device storage at app start. If nothing's ever been saved, proactively
 * asks for location permission and resolves GPS once — so a first-time
 * customer gets nearby content without having to find the location picker
 * themselves. If permission is denied (or GPS/geocoding fails), falls back to
 * the postal code/city/state captured at signup, so Home still has a
 * location to filter by. Renders nothing. Mounted once under Redux.
 */
export function LocationSync(): null {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user.currentUser);

  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await getStoredLocation();
      if (!active) {
        return;
      }

      if (stored) {
        dispatch(setLocation(stored));
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
  }, [dispatch, currentUser]);

  return null;
}
