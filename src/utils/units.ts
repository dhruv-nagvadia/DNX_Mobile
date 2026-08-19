/** Short display form of a selling unit, e.g. "L" for litre. */
export function unitShort(unit: string): string {
  return unit === 'litre' ? 'L' : unit;
}

/** True for count-type units (piece/dozen/pack…), false for weight/volume. */
export function isCountUnit(unit: string): boolean {
  return !['kg', 'g', 'gram', 'litre', 'ml', 'quintal'].includes(unit);
}

/** "10 kg in stock", "40 in stock", or "Out of stock". */
export function stockLabel(qty: number, unit: string): string {
  if (qty <= 0) return 'Out of stock';
  return isCountUnit(unit) ? `${qty} in stock` : `${qty} ${unitShort(unit)} in stock`;
}

/** Money in minor units → "₹120" (or "120 USD"). */
export function formatMoney(minor: number, currency = 'INR'): string {
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' ? `₹${amount}` : `${amount} ${currency}`;
}
