import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { LocationScope } from '@/redux/api/provider/types';
import { CustomerLocation } from '@/utils/location';

/**
 * The customer's location as list/search query params. The backend searches
 * in distance rings around them — 10 km, widening to 20 → 50 → 100 km only
 * while a ring is empty — measured from these GPS coordinates when we have
 * them, else from the centre of their PIN code. City/state are only used if
 * the backend can't place the PIN at all.
 */
export function useLocationFilter() {
  const loc = useAppSelector((s) => s.location.current);
  const filter = useMemo(
    () => ({
      ...(loc?.lat != null && loc?.lng != null ? { lat: loc.lat, lng: loc.lng } : {}),
      ...(loc?.postalCode ? { postalCode: loc.postalCode } : {}),
      ...(loc?.city ? { city: loc.city } : {}),
      ...(loc?.state ? { state: loc.state } : {}),
    }),
    [loc?.lat, loc?.lng, loc?.postalCode, loc?.city, loc?.state],
  );
  return { filter, location: loc };
}

/**
 * "How far did we have to look" note above a list, or null when the results
 * are close by (the first 10 km ring). Falls back to the city/state wording
 * when the backend could only match by text.
 */
export function locationNote(
  result: { radiusKm?: number | null; locationScope?: LocationScope } | undefined,
  loc: CustomerLocation | null | undefined,
): string | null {
  if (!result) {
    return null;
  }
  if (result.radiusKm != null) {
    return result.radiusKm > 10 ? `Showing results within ${result.radiusKm} km of you` : null;
  }
  if (result.locationScope === 'city') {
    return `Showing results across ${loc?.city ?? 'your city'}`;
  }
  if (result.locationScope === 'state') {
    return `Showing results across ${loc?.state ?? 'your state'}`;
  }
  return null;
}
