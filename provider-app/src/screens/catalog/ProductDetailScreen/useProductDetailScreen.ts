import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useDeleteProductMutation,
  useGetMyBusinessQuery,
  useGetMyOrdersQuery,
  useGetProductReviewsQuery,
  useGetStockAdjustmentsQuery,
  useUpdateProductMutation,
} from '@/redux/api/business/businessApi';
import { ROUTES } from '@/navigation/routes';
import { LOW_STOCK_FACTOR } from '@/utils/units';

import { productStock } from '../ProductsScreen/useProductsScreen';
import { ProductDetailNavigationProp, ProductDetailRouteProp } from './types';

/** How many history rows the "Recent stock changes" card shows. */
export const RECENT_CHANGES = 3;
/** Reviews shown before "See all reviews" expands the list. */
export const REVIEWS_PREVIEW = 2;
/** History rows fetched — enough to size the stock bar from past peaks. */
const HISTORY_LIMIT = 50;

export interface SalesStats {
  orders: number;
  /** Units sold, in the product's base unit. */
  sold: number;
  revenueMinor: number;
  lastOrderedAt: string | null;
}

export function useProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const { businessId, productId } = route.params;

  const businessQ = useGetMyBusinessQuery(businessId);
  const ordersQ = useGetMyOrdersQuery();
  const historyQ = useGetStockAdjustmentsQuery({ businessId, productId, limit: HISTORY_LIMIT });
  const reviewsQ = useGetProductReviewsQuery(productId);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const business = businessQ.data;
  const product = useMemo(
    () => business?.products?.find((p) => p.id === productId),
    [business?.products, productId],
  );

  // The endpoint filters by product, but guard against older backends that ignore the param.
  const history = useMemo(
    () => (historyQ.data ?? []).filter((h) => h.product?.id === undefined || h.product.id === productId),
    [historyQ.data, productId],
  );
  const reviews = useMemo(() => reviewsQ.data ?? [], [reviewsQ.data]);

  /** Order line items don't carry a productId, so lines are matched by name
   * within this business's non-cancelled orders. */
  const sales: SalesStats = useMemo(() => {
    const stats: SalesStats = { orders: 0, sold: 0, revenueMinor: 0, lastOrderedAt: null };
    if (!product) {
      return stats;
    }
    for (const order of ordersQ.data ?? []) {
      if (order.provider?.id !== businessId || order.status === 'CANCELLED') {
        continue;
      }
      // Match by product id; lines without one (product since deleted / older
      // data) fall back to the name snapshot taken at checkout.
      const lines = order.items.filter((it) =>
        it.productId ? it.productId === product.id : it.name === product.name,
      );
      if (lines.length === 0) {
        continue;
      }
      stats.orders += 1;
      for (const it of lines) {
        stats.sold += it.quantity;
        if (it.priceQty > 0) {
          stats.revenueMinor += Math.round((it.quantity / it.priceQty) * it.priceMinor);
        }
      }
      if (!stats.lastOrderedAt || new Date(order.createdAt) > new Date(stats.lastOrderedAt)) {
        stats.lastOrderedAt = order.createdAt;
      }
    }
    return stats;
  }, [ordersQ.data, product, businessId]);

  const stockState = product ? productStock(product) : 'ok';
  const madeToOrder = !!product?.unlimitedStock;
  /** Same rule as `stockLevel`: low at or below stepQty × LOW_STOCK_FACTOR. */
  const lowThreshold = product && product.stepQty > 0 ? product.stepQty * LOW_STOCK_FACTOR : 0;

  /** The stock bar's full width: current stock, twice the low threshold, or
   * the highest level seen in the history — whichever is largest. */
  const barScale = useMemo(() => {
    if (!product) {
      return 0;
    }
    let peak = Math.max(product.stockQty, lowThreshold * 2);
    for (const h of history) {
      if (h.stockAfter != null && h.stockAfter > peak) {
        peak = h.stockAfter;
      }
    }
    return peak;
  }, [product, lowThreshold, history]);

  const refreshing =
    (businessQ.isFetching || ordersQ.isFetching || historyQ.isFetching || reviewsQ.isFetching) && !businessQ.isLoading;

  const refresh = useCallback(() => {
    businessQ.refetch();
    ordersQ.refetch();
    historyQ.refetch();
    reviewsQ.refetch();
  }, [businessQ, ordersQ, historyQ, reviewsQ]);

  const toggleActive = () => {
    if (!product) {
      return;
    }
    updateProduct({ businessId, productId, data: { isActive: product.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const confirmDelete = () => {
    if (!product) {
      return;
    }
    Alert.alert('Delete product?', `"${product.name}" will be removed from your catalog.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProduct({ businessId, productId })
            .unwrap()
            .then(() => navigation.goBack())
            .catch(() => Alert.alert('Could not delete', 'Please try again.'));
        },
      },
    ]);
  };

  return {
    product,
    businessName: business?.businessName,
    isLoading: businessQ.isLoading,
    refreshing,
    refresh,
    history,
    reviews,
    showAllReviews,
    toggleReviews: () => setShowAllReviews((v) => !v),
    sales,
    stockState,
    madeToOrder,
    lowThreshold,
    barScale,
    deleting,
    toggleActive,
    confirmDelete,
    goBack: () => navigation.goBack(),
    editProduct: () => navigation.navigate(ROUTES.PRODUCT_FORM, { businessId, productId }),
    goToStock: () => navigation.navigate(ROUTES.STOCK, { businessId }),
  };
}
