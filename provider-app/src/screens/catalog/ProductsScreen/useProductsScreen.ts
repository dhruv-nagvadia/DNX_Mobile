import { useNavigation, useRoute } from '@react-navigation/native';

import { useDeleteProductMutation, useGetMyBusinessQuery, useUpdateProductMutation } from '@/redux/api/business/businessApi';
import { Product } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';

import { ProductsNavigationProp, ProductsRouteProp } from './types';

export function useProductsScreen() {
  const route = useRoute<ProductsRouteProp>();
  const navigation = useNavigation<ProductsNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const toggleActive = (product: Product) => {
    updateProduct({ businessId, productId: product.id, data: { isActive: product.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (productId: string) => {
    deleteProduct({ businessId, productId }).unwrap().catch(() => undefined);
  };

  return {
    products: business?.products ?? [],
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    deleting,
    toggleActive,
    remove,
    addProduct: () => navigation.navigate(ROUTES.PRODUCT_FORM, { businessId }),
    editProduct: (productId: string) => navigation.navigate(ROUTES.PRODUCT_FORM, { businessId, productId }),
    goToStock: () => navigation.navigate(ROUTES.STOCK, { businessId }),
  };
}
