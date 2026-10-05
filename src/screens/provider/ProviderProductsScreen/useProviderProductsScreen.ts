import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { Product } from '@/redux/api/provider/types';

import { ProviderProductsRouteProp } from './types';

export interface ProductGroup {
  section: string;
  items: Product[];
}

/** Groups a store's full catalog by its `section` field (uncategorized last). */
function groupBySection(products: Product[]): ProductGroup[] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const key = p.section?.trim() || 'More products';
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(p);
  }
  // Keep "More products" last regardless of where it first appeared.
  return [...map.entries()]
    .sort((a, b) => (a[0] === 'More products' ? 1 : b[0] === 'More products' ? -1 : 0))
    .map(([section, items]) => ({ section, items }));
}

/**
 * Loads a store's product catalog. When opened from one of its "shop by
 * category" tiles, `productTypeSlug` scopes this to a flat grid for that one
 * category (`null` = the untagged bucket). Opened without it, falls back to
 * the full catalog grouped by section.
 */
export function useProviderProductsScreen() {
  const { params } = useRoute<ProviderProductsRouteProp>();
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const { data: provider, isLoading } = useGetProviderByIdQuery({ id: params.providerId, postalCode });

  const hasCategoryFilter = params.productTypeSlug !== undefined;

  const products = useMemo(() => {
    const all = provider?.products ?? [];
    if (!hasCategoryFilter) {
      return all;
    }
    return all.filter((p) =>
      params.productTypeSlug === null ? !p.productType : p.productType?.slug === params.productTypeSlug,
    );
  }, [provider?.products, hasCategoryFilter, params.productTypeSlug]);

  const groups = useMemo(
    () => (hasCategoryFilter ? null : groupBySection(products)),
    [hasCategoryFilter, products],
  );

  return {
    title: params.categoryName ?? (params.businessName ? `${params.businessName} · Products` : 'Products'),
    provider,
    isLoading,
    groups,
    products,
    count: products.length,
  };
}
