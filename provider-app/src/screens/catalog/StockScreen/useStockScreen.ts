import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

import {
  useAdjustProductStockMutation,
  useGetMyBusinessQuery,
  useSetProductStockStatusMutation,
} from '@/redux/api/business/businessApi';
import { Product, StockAdjustmentReason } from '@/redux/api/business/types';
import { measureUnits, toBase } from '@/utils/units';

import { StockRouteProp } from './types';

/** Ports `frontend/src/components/StockManager/useStockManager.ts`'s flow:
 * search a product, then either toggle availability (unlimited-stock) or
 * adjust a quantity with a reason (tracked stock). */
export function useStockScreen() {
  const route = useRoute<StockRouteProp>();
  const { businessId } = route.params;

  const { data: business } = useGetMyBusinessQuery(businessId);
  const [adjustStock, { isLoading: adjusting }] = useAdjustProductStockMutation();
  const [setStockStatus, { isLoading: settingStatus }] = useSetProductStockStatusMutation();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [direction, setDirection] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('piece');
  const [reason, setReason] = useState<StockAdjustmentReason>('RESTOCK');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    const all = business?.products ?? [];
    if (!search.trim()) return all;
    const q = search.trim().toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(q));
  }, [business, search]);

  const selectProduct = useCallback((p: Product) => {
    setSelected(p);
    setAmount('');
    setUnit(measureUnits(p.measure)[0].value);
    setDirection('add');
    setReason('RESTOCK');
    setNote('');
    setError(null);
  }, []);

  const clearSelection = useCallback(() => setSelected(null), []);

  const toggleAvailability = useCallback(
    async (inStock: boolean) => {
      if (!selected) return;
      await setStockStatus({ businessId, productId: selected.id, inStock }).unwrap().catch(() => undefined);
      setSelected(null);
    },
    [selected, businessId, setStockStatus],
  );

  const markOutOfStock = useCallback(
    (product: Product) => {
      Alert.alert('Mark out of stock?', `"${product.name}" will show as unavailable to customers.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark out of stock',
          style: 'destructive',
          onPress: () => setStockStatus({ businessId, productId: product.id, inStock: false }).unwrap().catch(() => undefined),
        },
      ]);
    },
    [businessId, setStockStatus],
  );

  const submitAdjustment = useCallback(async () => {
    if (!selected) return;
    setError(null);
    const qty = Number(amount);
    if (!Number.isFinite(qty) || qty <= 0) return setError('Enter a valid amount');

    const base = toBase(qty, selected.measure, unit);
    const delta = direction === 'add' ? base : -base;

    try {
      await adjustStock({ businessId, productId: selected.id, data: { delta, reason, note: note.trim() || undefined } }).unwrap();
      setSelected(null);
      setAmount('');
      setNote('');
    } catch {
      setError('Could not update stock. Please try again.');
    }
  }, [selected, amount, unit, direction, reason, note, businessId, adjustStock]);

  return {
    search,
    setSearch,
    results,
    selected,
    selectProduct,
    clearSelection,
    direction,
    setDirection,
    amount,
    setAmount,
    unit,
    setUnit,
    reason,
    setReason,
    note,
    setNote,
    error,
    saving: adjusting || settingStatus,
    toggleAvailability,
    markOutOfStock,
    submitAdjustment,
  };
}
