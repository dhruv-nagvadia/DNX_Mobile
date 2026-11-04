import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useDeleteProductMutation, useGetMyBusinessQuery, useUpdateProductMutation } from '@/redux/api/business/businessApi';
import { Product } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';
import { stockLevel } from '@/utils/units';

import { ProductsNavigationProp, ProductsRouteProp } from './types';

/** The chip a product is grouped under: its section, else its product type. */
export function productGroup(p: Product): string | undefined {
  return p.section?.trim() || p.productType?.name?.trim() || undefined;
}

export type ProductStock = 'unlimited' | 'out' | 'low' | 'ok';

export function productStock(p: Product): ProductStock {
  if (p.unlimitedStock) {
    return p.stockQty <= 0 ? 'out' : 'unlimited';
  }
  return stockLevel(p.stockQty, p.stepQty);
}

export const ALL_SECTIONS = '__all__';

export function useProductsScreen() {
  const route = useRoute<ProductsRouteProp>();
  const navigation = useNavigation<ProductsNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const [query, setQuery] = useState('');
  const [section, setSection] = useState<string>(ALL_SECTIONS);

  const products = useMemo(() => business?.products ?? [], [business?.products]);

  const sections = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) {
      const g = productGroup(p);
      if (g) {
        seen.add(g);
      }
    }
    return [...seen];
  }, [products]);

  // Summary counts are over ALL products, not the filtered list.
  const counts = useMemo(() => {
    let active = 0;
    let low = 0;
    let out = 0;
    for (const p of products) {
      if (p.isActive !== false) {
        active += 1;
      }
      const s = productStock(p);
      if (s === 'out') {
        out += 1;
      } else if (s === 'low') {
        low += 1;
      }
    }
    return { active, low, out };
  }, [products]);

  // If the selected section disappears (e.g. its last product was deleted),
  // fall back to "All".
  const activeSection = section === ALL_SECTIONS || sections.includes(section) ? section : ALL_SECTIONS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeSection !== ALL_SECTIONS && productGroup(p) !== activeSection) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [p.name, p.section, p.productType?.name]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q));
    });
  }, [products, query, activeSection]);

  const toggleActive = (product: Product) => {
    updateProduct({ businessId, productId: product.id, data: { isActive: product.isActive === false } })
      .unwrap()
      .catch(() => undefined);
  };

  const remove = (productId: string) => {
    deleteProduct({ businessId, productId }).unwrap().catch(() => undefined);
  };

  return {
    businessName: business?.businessName,
    products,
    filtered,
    sections,
    counts,
    query,
    setQuery,
    section: activeSection,
    setSection,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    deleting,
    toggleActive,
    remove,
    goBack: () => navigation.goBack(),
    addProduct: () => navigation.navigate(ROUTES.PRODUCT_FORM, { businessId }),
    editProduct: (productId: string) => navigation.navigate(ROUTES.PRODUCT_FORM, { businessId, productId }),
    openProduct: (productId: string) => navigation.navigate(ROUTES.PRODUCT_DETAIL, { businessId, productId }),
    goToStock: () => navigation.navigate(ROUTES.STOCK, { businessId }),
  };
}
