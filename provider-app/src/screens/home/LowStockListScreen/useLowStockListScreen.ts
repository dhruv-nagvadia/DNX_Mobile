import { useCallback, useMemo, useState } from 'react';

import { useGetMyBusinessesQuery } from '@/redux/api/business/businessApi';
import { Business } from '@/redux/api/business/types';
import { stockLevel } from '@/utils/units';

import { LowStockItem } from './types';

const productStockLevel = (stockQty: number, stepQty: number, unlimitedStock?: boolean) =>
  unlimitedStock ? (stockQty <= 0 ? 'out' : 'ok') : stockLevel(stockQty, stepQty);

/** The full (unsliced) version of Home's "Low Stock" preview — Home's own
 * `deriveLowStock` caps itself at 6 items for the dashboard card, this
 * screen needs every low/out-of-stock product across every business. */
function deriveLowStock(businesses: Business[]): LowStockItem[] {
  const items: LowStockItem[] = [];
  businesses.forEach((b) => {
    (b.products ?? []).forEach((p) => {
      if (p.isActive === false) return;
      const level = productStockLevel(p.stockQty, p.stepQty, p.unlimitedStock);
      if (level === 'ok') return;
      items.push({ product: p, businessId: b.id, businessName: b.businessName, level });
    });
  });
  return items.sort((a, b) => {
    if (a.level !== b.level) return a.level === 'out' ? -1 : 1;
    return a.product.stockQty - b.product.stockQty;
  });
}

export function useLowStockListScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const businessesQuery = useGetMyBusinessesQuery();

  const lowStock = useMemo(() => deriveLowStock(businessesQuery.data ?? []), [businessesQuery.data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await businessesQuery.refetch().finally(() => setRefreshing(false));
  }, [businessesQuery]);

  return {
    lowStock,
    isLoading: businessesQuery.isLoading,
    refreshing,
    refresh,
  };
}
