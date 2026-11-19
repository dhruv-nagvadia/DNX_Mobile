import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useSearchProductsQuery } from '@/redux/api/provider/providerApi';
import { ProductSearchResult } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';
import { ProductTypeScreenNavigationProp, ProductTypeScreenRouteProp } from './types';

export interface StoreChip {
  id: string;
  name: string;
}

/** All products (pooled across every store) tagged with one product type. */
export function useProductTypeScreen() {
  const navigation = useNavigation<ProductTypeScreenNavigationProp>();
  const { params } = useRoute<ProductTypeScreenRouteProp>();
  const [storeId, setStoreId] = useState<string | null>(null);

  const { data, isFetching } = useSearchProductsQuery({
    productTypeSlug: params.slug,
    limit: 30,
  });

  const all = useMemo(() => data?.items ?? [], [data?.items]);

  // The stores present in the results, in first-seen order.
  const stores = useMemo<StoreChip[]>(() => {
    const seen = new Map<string, StoreChip>();
    for (const p of all) {
      if (!seen.has(p.provider.id)) {
        seen.set(p.provider.id, { id: p.provider.id, name: p.provider.businessName });
      }
    }
    return [...seen.values()];
  }, [all]);

  const products = useMemo(
    () => (storeId ? all.filter((p) => p.provider.id === storeId) : all),
    [all, storeId],
  );

  const onProductPress = useCallback(
    (p: ProductSearchResult) => {
      navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: p.provider.id, productId: p.id });
    },
    [navigation],
  );

  const n = all.length;
  const m = stores.length;
  const subtitle =
    n === 0
      ? undefined
      : `${n} ${n === 1 ? 'product' : 'products'} from ${m} ${m === 1 ? 'store' : 'stores'}`;

  return {
    title: params.name,
    subtitle,
    products,
    stores,
    storeId,
    setStoreId,
    isFetching,
    onProductPress,
  };
}
