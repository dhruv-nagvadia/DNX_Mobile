import { useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { Product } from '@/redux/api/provider/types';
import { amountPrice } from '@/utils/units';

import { ProviderProductsRouteProp } from './types';

export interface ProductGroup {
  section: string;
  items: Product[];
  /** At least one item in the group carries a coupon — shows a "Deal" tag. */
  hasCoupon: boolean;
}

const UNSECTIONED = 'More products';
const UNTAGGED = 'Other items';

/**
 * Groups a store's full catalog by its own `section` field (uncategorized
 * last). A store that set no sections at all is grouped by product type
 * instead — the same fallback the store page uses.
 */
function groupProducts(products: Product[]): ProductGroup[] {
  const hasSections = products.some((p) => !!p.section?.trim());
  const fallback = hasSections ? UNSECTIONED : UNTAGGED;
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const key = hasSections ? p.section?.trim() || UNSECTIONED : p.productType?.name || UNTAGGED;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(p);
  }
  // Keep the catch-all bucket last regardless of where it first appeared.
  return [...map.entries()]
    .sort((a, b) => (a[0] === fallback ? 1 : b[0] === fallback ? -1 : 0))
    .map(([section, items]) => ({
      section,
      items,
      hasCoupon: items.some((p) => !!p.coupon),
    }));
}

/**
 * Loads a store's product catalog. Opened from one of its "shop by category"
 * tiles, `productTypeSlug` scopes this to a flat grid for that one category
 * (`null` = the untagged bucket). Opened from one of its own section teasers,
 * `section` scopes it to that section instead. Opened without either, falls
 * back to the full catalog grouped by section, with a chip per group.
 */
export function useProviderProductsScreen() {
  const { params } = useRoute<ProviderProductsRouteProp>();
  const postalCode = useAppSelector((s) => s.location.current?.postalCode);
  const cartItems = useAppSelector((s) => s.cart.items);
  const { data: provider, isLoading } = useGetProviderByIdQuery({
    id: params.providerId,
    postalCode,
  });
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const hasCategoryFilter = params.productTypeSlug !== undefined;
  const hasSectionFilter = params.section !== undefined;
  const isFullCatalog = !hasCategoryFilter && !hasSectionFilter;

  const products = useMemo(() => {
    const all = provider?.products ?? [];
    if (hasCategoryFilter) {
      return all.filter((p) =>
        params.productTypeSlug === null
          ? !p.productType
          : p.productType?.slug === params.productTypeSlug,
      );
    }
    if (hasSectionFilter) {
      return all.filter((p) => p.section?.trim() === params.section);
    }
    return all;
  }, [
    provider?.products,
    hasCategoryFilter,
    hasSectionFilter,
    params.productTypeSlug,
    params.section,
  ]);

  const allGroups = useMemo(
    () => (isFullCatalog ? groupProducts(products) : null),
    [isFullCatalog, products],
  );

  // A group chip narrows the full catalog to that one group.
  const groups = useMemo(
    () =>
      allGroups && activeGroup ? allGroups.filter((g) => g.section === activeGroup) : allGroups,
    [allGroups, activeGroup],
  );

  // Local search over whatever this screen is showing.
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) {
      return [];
    }
    const pool = groups ? groups.flatMap((g) => g.items) : products;
    return pool.filter((p) => p.name.toLowerCase().includes(q));
  }, [groups, products, q]);

  // Cart bar — only this store's lines.
  const storeItems = cartItems.filter((i) => i.quantity > 0 && i.providerId === params.providerId);
  const cartTotal = storeItems.reduce(
    (s, i) => s + amountPrice(i.quantity, i.priceQty, i.priceMinor),
    0,
  );

  const businessName = provider?.businessName ?? params.businessName;
  const count = products.length;

  return {
    title: params.categoryName ?? params.section ?? 'All products',
    subtitle: [`${count} ${count === 1 ? 'item' : 'items'}`, businessName]
      .filter(Boolean)
      .join(' • '),
    businessName,
    provider,
    isLoading,
    groups,
    groupChips: allGroups && allGroups.length > 1 ? allGroups.map((g) => g.section) : [],
    activeGroup,
    setActiveGroup,
    products,
    count,
    query,
    setQuery,
    searching: q.length > 0,
    results,
    cartCount: storeItems.length,
    cartTotal,
  };
}
