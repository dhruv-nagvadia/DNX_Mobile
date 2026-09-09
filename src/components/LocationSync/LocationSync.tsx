import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { setLocation } from '@/redux/slices/locationSlice';
import { getStoredLocation } from '@/utils/location';

/**
 * Loads the customer's saved search location (GPS or manual city/PIN) from
 * on-device storage at app start. Renders nothing. Mounted once under Redux.
 */
export function LocationSync(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    getStoredLocation().then((loc) => {
      if (active && loc) dispatch(setLocation(loc));
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  return null;
}
