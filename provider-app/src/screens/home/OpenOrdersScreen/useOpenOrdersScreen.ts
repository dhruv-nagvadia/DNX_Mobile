import { useCallback, useMemo, useState } from 'react';

import { useGetMyOrdersQuery } from '@/redux/api/business/businessApi';
import { BusinessOrder } from '@/redux/api/business/types';

const isOpenOrder = (o: BusinessOrder) =>
  o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'READY';

/** The full (unsliced) version of Home's "Orders to Fulfil" preview. */
export function useOpenOrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const ordersQuery = useGetMyOrdersQuery();

  const openOrders = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    return orders
      .filter(isOpenOrder)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [ordersQuery.data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await ordersQuery.refetch().finally(() => setRefreshing(false));
  }, [ordersQuery]);

  return {
    openOrders,
    isLoading: ordersQuery.isLoading,
    refreshing,
    refresh,
  };
}
