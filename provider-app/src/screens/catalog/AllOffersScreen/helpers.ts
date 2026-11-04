import { Layers, Scissors, ShoppingCart } from 'lucide-react-native';

import { Coupon } from '@/redux/api/business/types';
import { CouponStatus } from '@/screens/catalog/CouponsScreen/useCouponsScreen';
import { formatMoney } from '@/utils/money';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Dot colours for business chips / card pills. */
const BUSINESS_COLORS = ['#7C3AED', '#16A34A', '#2563EB', '#EA580C', '#DB2777', '#0D9488', '#CA8A04', '#4F46E5'];

/** Deterministic colour per business id, so a business keeps its dot colour. */
export function businessColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) % 1000003;
  }
  return BUSINESS_COLORS[h % BUSINESS_COLORS.length];
}

/** "Dec 31, 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Big headline ("10% OFF" / "₹50 OFF") plus sub-lines ("up to ₹200", "above ₹499"). */
export function discountParts(c: Coupon): { main: string; lines: string[] } {
  const lines: string[] = [];
  if (c.discountType === 'PERCENT' && c.maxDiscountMinor) {
    lines.push(`up to ${formatMoney(c.maxDiscountMinor)}`);
  }
  if (c.minOrderMinor > 0) {
    lines.push(`above ${formatMoney(c.minOrderMinor)}`);
  }
  const main = c.discountType === 'PERCENT' ? `${c.discountValue}% OFF` : `${formatMoney(c.discountValue)} OFF`;
  return { main, lines };
}

export function scopeRow(c: Coupon): { label: string; Icon: typeof ShoppingCart } {
  if (c.scope === 'SERVICE') {
    return { label: c.service ? `On ${c.service.name} (service)` : 'On any service', Icon: Scissors };
  }
  if (c.scope === 'PRODUCT') {
    return { label: c.product ? `On ${c.product.name} (product)` : 'On any product', Icon: Layers };
  }
  return {
    label: c.minOrderMinor > 0 ? `On orders above ${formatMoney(c.minOrderMinor)}` : 'On any order',
    Icon: ShoppingCart,
  };
}

export function expiryLabel(c: Coupon, status: CouponStatus): string {
  if (!c.expiresAt) {
    return 'No expiry';
  }
  const date = formatDate(c.expiresAt);
  return status === 'expired' ? `Expired on ${date}` : `Expires ${date}`;
}

