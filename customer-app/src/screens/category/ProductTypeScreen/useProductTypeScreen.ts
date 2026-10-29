import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useSearchProductsQuery } from '@/redux/api/provider/providerApi';
import { ProductSearchResult } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';
import { ProductTypeScreenNavigationProp, ProductTypeScreenRouteProp } from './types';

/** All products (pooled across every store) tagged with one product type. */
export function useProductTypeScreen() {
  const navigation = useNavigation<ProductTypeScreenNavigationProp>();
  const { params } = useRoute<ProductTypeScreenRouteProp>();

  const { data, isFetching } = useSearchProductsQuery({
    productTypeSlug: params.slug,
    limit: 30,
  });

  const onProductPress = useCallback(
    (p: ProductSearchResult) => {
      navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: p.provider.id, productId: p.id });
    },
    [navigation],
  );

  return {
    title: params.name,
    products: data?.items ?? [],
    isFetching,
    onProductPress,
  };
}
