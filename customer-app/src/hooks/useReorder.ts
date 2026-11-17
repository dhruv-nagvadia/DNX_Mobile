import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES, RootStackParamList } from '@/navigation/routes';
import type { Order } from '@/redux/api/order/types';
import { useLazyGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import type { Provider } from '@/redux/api/provider/types';
import { useAppDispatch } from '@/redux/hooks';
import { setCartQty } from '@/redux/slices/cartSlice';

/**
 * "Reorder": re-adds a past order's items to the cart at TODAY's price and
 * stock (from the store's live catalog, not the order's snapshot), skips
 * anything discontinued or now out of stock, then opens the Cart. Shared by
 * the Order details screen and the Bookings & Orders list.
 */
export function useReorder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [fetchProvider] = useLazyGetProviderByIdQuery();
  const [busyId, setBusyId] = useState<string | null>(null);

  const reorder = useCallback(
    async (order: Order, liveProvider?: Provider) => {
      let store = liveProvider;
      if (!store) {
        setBusyId(order.id);
        try {
          store = await fetchProvider({ id: order.provider.id }, true).unwrap();
        } catch {
          Alert.alert('Couldn’t load the store', 'Check your connection and try again.');
          return;
        } finally {
          setBusyId(null);
        }
      }

      const skipped: string[] = [];
      let addedCount = 0;
      for (const it of order.items) {
        const product = it.productId
          ? store.products?.find((p) => p.id === it.productId)
          : undefined;
        if (!product || (!product.unlimitedStock && product.stockQty <= 0)) {
          skipped.push(it.name);
          continue;
        }
        const quantity = product.unlimitedStock
          ? it.quantity
          : Math.min(it.quantity, product.stockQty);
        if (quantity < product.stepQty) {
          skipped.push(it.name);
          continue;
        }
        dispatch(
          setCartQty({
            item: {
              productId: product.id,
              providerId: store.id,
              providerName: store.businessName,
              name: product.name,
              measure: product.measure,
              priceMinor: product.priceMinor,
              priceQty: product.priceQty,
              currency: product.currency,
              stockQty: product.stockQty,
              unlimitedStock: product.unlimitedStock,
              stepQty: product.stepQty,
              imageUrl: product.imageUrl,
              depositPercent: store.depositPercent,
              codEnabled: product.codEnabled,
              partialPayEnabled: product.partialPayEnabled,
            },
            quantity,
          }),
        );
        addedCount += 1;
      }
      if (addedCount === 0) {
        Alert.alert('Nothing to reorder', 'These items are no longer available at this store.');
        return;
      }
      if (skipped.length > 0) {
        Alert.alert(
          'Some items unavailable',
          `${skipped.join(', ')} could not be added — out of stock or no longer sold.`,
        );
      }
      navigation.navigate(ROUTES.CART);
    },
    [dispatch, fetchProvider, navigation],
  );

  return { reorder, busyId };
}
