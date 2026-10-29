// Ports `frontend/src/utils/units.ts` 1:1 — the pricing/stock math for the
// STORE catalog. Stock, minimum-order-step, and price-quantity are ALL
// stored in one base unit per measure (g/ml/piece); kg/litre/dozen only
// ever appear as a data-entry convenience in the product form.
import { Measure } from '@/redux/api/business/types';

interface UnitOpt {
  value: string;
  label: string;
  factor: number;
}

export const MEASURES: { value: Measure; label: string; base: string; units: UnitOpt[] }[] = [
  {
    value: 'weight',
    label: 'Weight — grains, flour, vegetables…',
    base: 'g',
    units: [
      { value: 'kg', label: 'kg', factor: 1000 },
      { value: 'g', label: 'g', factor: 1 },
    ],
  },
  {
    value: 'volume',
    label: 'Volume — oil, milk, liquids…',
    base: 'ml',
    units: [
      { value: 'litre', label: 'litre', factor: 1000 },
      { value: 'ml', label: 'ml', factor: 1 },
    ],
  },
  {
    value: 'count',
    label: 'Count / pack — pieces, packets…',
    base: 'piece',
    units: [
      { value: 'piece', label: 'piece', factor: 1 },
      { value: 'dozen', label: 'dozen', factor: 12 },
    ],
  },
];

export function measureUnits(measure: Measure): UnitOpt[] {
  return (MEASURES.find((m) => m.value === measure) ?? MEASURES[2]).units;
}

export function unitFactor(measure: Measure, unit: string): number {
  return measureUnits(measure).find((u) => u.value === unit)?.factor ?? 1;
}

export function toBase(qty: number, measure: Measure, unit: string): number {
  return qty * unitFactor(measure, unit);
}

const fmt = (x: number) => (Number.isInteger(x) ? `${x}` : `${parseFloat(x.toFixed(3))}`);

export function formatAmount(base: number, measure: Measure): string {
  if (measure === 'weight') return base >= 1000 ? `${fmt(base / 1000)} kg` : `${fmt(base)} g`;
  if (measure === 'volume') return base >= 1000 ? `${fmt(base / 1000)} L` : `${fmt(base)} ml`;
  return `${fmt(base)} ${base === 1 ? 'pc' : 'pcs'}`;
}

export function splitAmount(base: number, measure: Measure): { value: number; unit: string } {
  if (measure === 'weight') return base >= 1000 ? { value: base / 1000, unit: 'kg' } : { value: base, unit: 'g' };
  if (measure === 'volume')
    return base >= 1000 ? { value: base / 1000, unit: 'litre' } : { value: base, unit: 'ml' };
  return { value: base, unit: 'piece' };
}

export function stockLabel(base: number, measure: Measure): string {
  return base <= 0 ? 'Out of stock' : `${formatAmount(base, measure)} in stock`;
}

export const LOW_STOCK_FACTOR = 5;
export type StockLevel = 'out' | 'low' | 'ok';

export function stockLevel(stockQty: number, stepQty: number): StockLevel {
  if (stockQty <= 0) return 'out';
  if (stepQty > 0 && stockQty <= stepQty * LOW_STOCK_FACTOR) return 'low';
  return 'ok';
}

export function priceLabel(priceMinor: number, priceQty: number, measure: Measure, currency = 'INR'): string {
  const amount = (priceMinor / 100).toLocaleString('en-IN');
  const money = currency === 'INR' ? `₹${amount}` : `${amount} ${currency}`;
  return `${money} / ${formatAmount(priceQty, measure)}`;
}

export const SECTION_SUGGESTIONS = [
  'Grains & Rice',
  'Pulses & Dal',
  'Flour & Atta',
  'Spices & Masala',
  'Oil & Ghee',
  'Dairy',
  'Bakery',
  'Snacks & Namkeen',
  'Beverages',
  'Dry Fruits',
  'Personal Care',
  'Household & Cleaning',
  'Baby Care',
  'Stationery',
];
