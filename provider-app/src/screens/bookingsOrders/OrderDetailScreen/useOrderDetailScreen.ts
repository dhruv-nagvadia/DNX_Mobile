import { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCollectOrderPaymentMutation,
  useGetMyOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/redux/api/business/businessApi';
import { OrderStatus } from '@/redux/api/business/types';

import { OrderDetailNavigationProp, OrderDetailRouteProp } from './types';

/**
 * Single-order view. There's no single-item fetch endpoint — RTK Query
 * dedupes this against the same no-arg `useGetMyOrdersQuery()` the list
 * screen already calls, so landing here straight from Home costs no extra
 * round trip. Status/collect actions reuse the exact same mutations as
 * `BookingsOrdersScreen` so both stay in lockstep via tag invalidation.
 */
export function useOrderDetailScreen() {
  const route = useRoute<OrderDetailRouteProp>();
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const { orderId } = route.params;

  const { data: orders, isLoading, isFetching, refetch } = useGetMyOrdersQuery();
  const order = orders?.find((o) => o.id === orderId);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [collectOrderPayment] = useCollectOrderPaymentMutation();
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showCollect, setShowCollect] = useState(false);

  const advance = useCallback(
    async (status: OrderStatus) => {
      if (!order) {
        return;
      }
      setActionLoading(true);
      await updateOrderStatus({ orderId: order.id, businessId: order.provider.id, status })
        .unwrap()
        .catch(() => undefined);
      setActionLoading(false);
    },
    [order, updateOrderStatus],
  );

  const openCancel = useCallback(() => {
    setReason('');
    setShowCancel(true);
  }, []);
  const closeCancel = useCallback(() => setShowCancel(false), []);

  const submitCancel = useCallback(async () => {
    if (!order) {
      return;
    }
    setActionLoading(true);
    await updateOrderStatus({
      orderId: order.id,
      businessId: order.provider.id,
      status: 'CANCELLED',
      reason: reason.trim() || undefined,
    })
      .unwrap()
      .catch(() => undefined);
    setActionLoading(false);
    setShowCancel(false);
  }, [order, reason, updateOrderStatus]);

  // Same "Mark as paid?" confirm step the Orders list uses before collecting.
  const openCollect = useCallback(() => setShowCollect(true), []);
  const closeCollect = useCallback(() => setShowCollect(false), []);

  const collectNow = useCallback(async () => {
    if (!order) {
      return;
    }
    setActionLoading(true);
    await collectOrderPayment({ orderId: order.id }).unwrap().catch(() => undefined);
    setActionLoading(false);
    setShowCollect(false);
  }, [order, collectOrderPayment]);

  return {
    order,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    actionLoading,
    advance,
    collectNow,
    showCollect,
    openCollect,
    closeCollect,
    showCancel,
    reason,
    setReason,
    openCancel,
    closeCancel,
    submitCancel,
    goBack: () => navigation.goBack(),
  };
}
