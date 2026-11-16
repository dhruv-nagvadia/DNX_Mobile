import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';

/**
 * The customer's location as provider-list query params. The backend tries
 * postal code first, then widens to city, then state.
 */
export function useLocationFilter() {
  const loc = useAppSelector((s) => s.location.current);
  const filter = useMemo(
    () => ({
      ...(loc?.postalCode ? { postalCode: loc.postalCode } : {}),
      ...(loc?.city ? { city: loc.city } : {}),
      ...(loc?.state ? { state: loc.state } : {}),
    }),
    [loc?.postalCode, loc?.city, loc?.state],
  );
  return { filter, location: loc };
}
