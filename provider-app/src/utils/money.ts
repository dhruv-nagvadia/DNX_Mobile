/** Formats a minor-unit amount (e.g. paise) as a currency string, e.g. "₹1,234". */
export function formatMoney(minor: number, currency = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : `${currency} `;
  return `${symbol}${Math.round(minor / 100).toLocaleString('en-IN')}`;
}
