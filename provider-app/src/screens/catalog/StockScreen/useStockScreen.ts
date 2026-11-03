import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useAdjustProductStockMutation,
  useGetMyBusinessQuery,
  useGetStockAdjustmentsQuery,
  useSetProductStockStatusMutation,
} from '@/redux/api/business/businessApi';
import { Product, StockAdjustmentReason } from '@/redux/api/business/types';
import { measureUnits, stockLevel, toBase } from '@/utils/units';

import { StockRouteProp } from './types';

export type StockFilter = 'all' | 'low' | 'out';

/** Recent-changes list: latest few by default, "View all" loads up to this many. */
const RECENT_LIMIT = 3;
const ALL_LIMIT = 50;

export function isOut(p: Product): boolean {
  return p.unlimitedStock ? p.stockQty <= 0 : stockLevel(p.stockQty, p.stepQty) === 'out';
}

export function isLow(p: Product): boolean {
  return !p.unlimitedStock && stockLevel(p.stockQty, p.stepQty) === 'low';
}

/** Ports `frontend/src/components/StockManager/useStockManager.ts`'s flow:
 * search a product, then either toggle availability (unlimited-stock) or
 * adjust a quantity with a reason (tracked stock). */
export function useStockScreen() {
  const route = useRoute<StockRouteProp>();
  const navigation = useNavigation();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const {
    data: adjustments,
    isLoading: historyLoading,
    isFetching: historyFetching,
    refetch: refetchHistory,
  } = useGetStockAdjustmentsQuery({ businessId, limit: showAllHistory ? ALL_LIMIT : RECENT_LIMIT });
  const [adjustStock, { isLoading: adjusting }] = useAdjustProductStockMutation();
  const [setStockStatus, { isLoading: settingStatus }] = useSetProductStockStatusMutation();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');
  // Keep only the id so the selected product always reflects the latest
  // fetched stock (e.g. right after an adjustment).
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [direction, setDirection] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('piece');
  const [reason, setReason] = useState<StockAdjustmentReason>('RESTOCK');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const products = useMemo(() => business?.products ?? [], [business?.products]);
  const selected = useMemo(() => products.find((p) => p.id === selectedId) ?? null, [products, selectedId]);

  // Summary counts are over ALL products.
  const counts = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const p of products) {
      if (isOut(p)) {
        out += 1;
      } else if (isLow(p)) {
        low += 1;
      }
    }
    return { inStock: products.length - low - out, low, out };
  }, [products]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === 'low' && !isLow(p)) {
        return false;
      }
      if (filter === 'out' && !isOut(p)) {
        return false;
      }
      return !q || p.name.toLowerCase().includes(q);
    });
  }, [products, search, filter]);

  const selectProduct = useCallback((p: Product) => {
    setSelectedId(p.id);
    setAmount('');
    setUnit(measureUnits(p.measure)[0].value);
    setDirection('add');
    setReason('RESTOCK');
    setNote('');
    setError(null);
  }, []);

  // Auto-select the first product once, when the catalog first loads.
  const autoSelected = useRef(false);
  useEffect(() => {
    if (!autoSelected.current && products.length > 0) {
      autoSelected.current = true;
      if (!selectedId) {
        selectProduct(products[0]);
      }
    }
  }, [products, selectedId, selectProduct]);

  const clearSelection = useCallback(() => setSelectedId(null), []);

  const toggleAvailability = useCallback(
    async (inStock: boolean) => {
      if (!selected) {
        return;
      }
      await setStockStatus({ businessId, productId: selected.id, inStock }).unwrap().catch(() => undefined);
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
    if (!selected) {
      return;
    }
    setError(null);
    const qty = Number(amount);
    if (!Number.isFinite(qty) || qty <= 0) {
      return setError('Enter a valid amount');
    }

    const base = toBase(qty, selected.measure, unit);
    const delta = direction === 'add' ? base : -base;

    try {
      await adjustStock({ businessId, productId: selected.id, data: { delta, reason, note: note.trim() || undefined } }).unwrap();
      setAmount('');
      setNote('');
    } catch {
      setError('Could not update stock. Please try again.');
    }
  }, [selected, amount, unit, direction, reason, note, businessId, adjustStock]);

  const refresh = useCallback(() => {
    refetch();
    refetchHistory();
  }, [refetch, refetchHistory]);

  return {
    businessName: business?.businessName,
    products,
    counts,
    isLoading,
    refreshing: isFetching && !isLoading,
    refresh,
    goBack: () => navigation.goBack(),
    search,
    setSearch,
    filter,
    setFilter,
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
    adjustments: adjustments ?? [],
    historyLoading: historyLoading || (historyFetching && !adjustments),
    showAllHistory,
    toggleShowAllHistory: () => setShowAllHistory((v) => !v),
  };
}
