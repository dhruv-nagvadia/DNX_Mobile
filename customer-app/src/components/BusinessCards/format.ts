import { Provider } from '@/redux/api/provider/types';
import { formatMoney } from '@/utils/units';

/** Cheapest service price, for the "From ₹…" column (null if none were sent). */
export function fromPrice(p: Provider): string | null {
  if (!p.services?.length) {
    return null;
  }
  const min = p.services.reduce((m, s) => Math.min(m, s.priceMinor), Number.POSITIVE_INFINITY);
  return formatMoney(min, p.services[0].currency).replace(/\.00$/, '');
}

export function km(d?: number | null): string | null {
  return d == null ? null : `${d < 10 ? d.toFixed(1) : Math.round(d)} km`;
}
