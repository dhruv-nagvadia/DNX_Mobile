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

/** Unit price, but "₹5 each" for single-piece items (clearer than "₹5 / 1 pc"). */
export function unitPriceLabel(
  priceMinor: number,
  priceQty: number,
  measure: Measure,
  currency = 'INR',
): string {
  if (measure === 'count' && priceQty === 1) return `${formatMoney(priceMinor, currency)} each`;
  return priceLabel(priceMinor, priceQty, measure, currency);
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

/** A unit the buyer can pick to enter an amount in. `base` = base units per 1. */
export interface AmountUnit {
  label: string;
  base: number;
}

/** Units a buyer can switch between for a measure (e.g. weight → g / kg). */
export function amountUnits(measure: Measure): AmountUnit[] {
  if (measure === 'weight') {
    return [
      { label: 'g', base: 1 },
      { label: 'kg', base: 1000 },
    ];
  }
  if (measure === 'volume') {
    return [
      { label: 'ml', base: 1 },
      { label: 'L', base: 1000 },
    ];
  }
  return [{ label: 'pcs', base: 1 }];
}

/** Format a base-unit amount in a specific chosen unit, e.g. 1500 in kg → "1.5 kg". */
export function formatAmountIn(base: number, unit: AmountUnit): string {
  const v = base / unit.base;
  const shown = Number.isInteger(v) ? `${v}` : `${parseFloat(v.toFixed(3))}`;
  return `${shown} ${unit.label}`;
}

/** Base increment for +/- adjustments — independent of the product minimum. */
export function baseIncrement(measure: Measure): number {
  return measure === 'count' ? 1 : 100; // 1 piece, or 100 g / 100 ml
}

/** Increment (base units) for +/- in a given display unit (100 g/ml, or 1 kg/L). */
export function incrementFor(measure: Measure, unit: AmountUnit): number {
  return unit.base === 1 ? baseIncrement(measure) : unit.base;
}
