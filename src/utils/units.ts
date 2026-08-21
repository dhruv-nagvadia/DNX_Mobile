export type Measure = 'weight' | 'volume' | 'count';

const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : `${parseFloat(x.toFixed(3))}`);

/** Human amount for a base-unit value, e.g. 15000 (weight) → "15 kg". */
export function formatAmount(base: number, measure: Measure): string {
  if (measure === 'weight') return base >= 1000 ? `${fmt(base / 1000)} kg` : `${fmt(base)} g`;
  if (measure === 'volume') return base >= 1000 ? `${fmt(base / 1000)} L` : `${fmt(base)} ml`;
  return `${fmt(base)} ${base === 1 ? 'pc' : 'pcs'}`;
}

/** Money in minor units → "₹120" (or "120 USD"). */
export function formatMoney(minor: number, currency = 'INR'): string {
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' ? `₹${amount}` : `${amount} ${currency}`;
}

/** Price line, e.g. "₹200 / 100 g". */
export function priceLabel(priceMinor: number, priceQty: number, measure: Measure, currency = 'INR'): string {
  return `${formatMoney(priceMinor, currency)} / ${formatAmount(priceQty, measure)}`;
}

/** "10 kg in stock" / "Out of stock". */
export function stockLabel(base: number, measure: Measure): string {
  return base <= 0 ? 'Out of stock' : `${formatAmount(base, measure)} in stock`;
}

/** Price to charge for a chosen amount: (amount / priceQty) × priceMinor. */
export function amountPrice(amount: number, priceQty: number, priceMinor: number): number {
  if (!priceQty) return 0;
  return Math.round((amount / priceQty) * priceMinor);
}
