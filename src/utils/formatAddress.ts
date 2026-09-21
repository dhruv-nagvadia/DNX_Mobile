import { Address } from '@/redux/api/address/types';

/** Full postal address for display — `line` only holds house/flat + area/street. */
export function formatAddress(a: Address): string {
  return [a.line, a.city, a.state, a.postalCode].filter(Boolean).join(', ');
}
