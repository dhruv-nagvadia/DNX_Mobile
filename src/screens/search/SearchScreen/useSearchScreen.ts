import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  useGetProvidersQuery,
  useSearchProductsQuery,
  useSearchServicesQuery,
} from '@/redux/api/provider/providerApi';
import { useAppSelector } from '@/redux/hooks';
import { ProductSearchResult, Provider, ServiceSearchResult } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';
import {
  addRecentSearch,
  addRecentSearchView,
  clearRecentSearches as clearRecentSearchesStorage,
  clearRecentSearchViews as clearRecentSearchViewsStorage,
  getRecentSearches,
  getRecentSearchViews,
  SearchViewItem,
} from '@/utils/searchHistory';

import { SearchNavigationProp } from './types';

export type TypeFilter = 'ALL' | 'SERVICE' | 'PRODUCT' | 'BUSINESS';

// Below this, there's nothing meaningful to search on yet.
const MIN_QUERY_LENGTH = 3;

/** Provider/service/product search, with a type toggle and the customer's location — no other filters. */
export function useSearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();

  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('ALL');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentSearchViews, setRecentSearchViews] = useState<SearchViewItem[]>([]);

  useEffect(() => {
    getRecentSearches().then(setRecentSearches);
    getRecentSearchViews().then(setRecentSearchViews);
  }, []);

  const trimmed = query.trim();
  // Nothing to browse without a search — below this, show recent
  // searches/views instead of firing a query.
  const hasActiveQuery = trimmed.length >= MIN_QUERY_LENGTH;

  // The customer's chosen search location narrows results to their area.
  const location = useAppSelector((s) => s.location.current);

  const isProductSearch = type === 'PRODUCT';
  const isServiceSearch = type === 'SERVICE';
  const isAllSearch = type === 'ALL';

  // "All" merges business/service/product searches into one, sectioned
  // result rather than a single broad match, so each hit renders exactly
  // like it would under its own dedicated type.
  const runProviders = (isAllSearch || type === 'BUSINESS') && hasActiveQuery;
  const runProducts = (isAllSearch || isProductSearch) && hasActiveQuery;
  const runServices = (isAllSearch || isServiceSearch) && hasActiveQuery;

  const { data, isFetching: providersFetching } = useGetProvidersQuery(
    {
      search: trimmed,
      city: location?.mode === 'manual' ? location.city : undefined,
      postalCode: location?.mode === 'manual' ? location.postalCode : undefined,
      limit: 30,
    },
    { skip: !runProviders },
  );

  const { data: productData, isFetching: productsFetching } = useSearchProductsQuery(
    {
      search: trimmed,
      city: location?.mode === 'manual' ? location.city : undefined,
      postalCode: location?.mode === 'manual' ? location.postalCode : undefined,
      limit: 30,
    },
    { skip: !runProducts },
  );

  const { data: serviceData, isFetching: servicesFetching } = useSearchServicesQuery(
    {
      search: trimmed,
      city: location?.mode === 'manual' ? location.city : undefined,
      postalCode: location?.mode === 'manual' ? location.postalCode : undefined,
      limit: 30,
    },
    { skip: !runServices },
  );

  const selectType = useCallback((t: TypeFilter) => setType(t), []);

  // Opening a result is what "counts" as a completed search — that's when
  // the typed term and the item itself both get remembered.
  const recordVisit = useCallback(
    (entry: SearchViewItem) => {
      if (trimmed) addRecentSearch(trimmed).then(setRecentSearches);
      addRecentSearchView(entry).then(setRecentSearchViews);
    },
    [trimmed],
  );

  const onProviderPress = useCallback(
    (p: Provider) => {
      recordVisit({ kind: 'provider', item: p });
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName });
    },
    [navigation, recordVisit],
  );

  const onProductPress = useCallback(
    (p: ProductSearchResult) => {
      recordVisit({ kind: 'product', item: p });
      navigation.navigate(ROUTES.PRODUCT_DETAILS, { providerId: p.provider.id, productId: p.id });
    },
    [navigation, recordVisit],
  );

  // Opens the service's business with that exact service pre-selected, so
  // the customer lands straight on choosing a date/time — the same
  // mechanism "Book again" uses (a service id with no reschedule-booking id
  // just pre-selects a service for a fresh booking).
  const onServicePress = useCallback(
    (s: ServiceSearchResult) => {
      recordVisit({ kind: 'service', item: s });
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: s.provider.id,
        name: s.provider.businessName,
        rescheduleServiceId: s.id,
      });
    },
    [navigation, recordVisit],
  );

  const onRecentSearchPress = useCallback((term: string) => setQuery(term), []);

  // Recently-viewed cards reopen exactly like tapping the live result would
  // (same navigation, and it re-bumps the item to the front of the list).
  const onRecentViewPress = useCallback(
    (entry: SearchViewItem) => {
      if (entry.kind === 'provider') onProviderPress(entry.item);
      else if (entry.kind === 'product') onProductPress(entry.item);
      else onServicePress(entry.item);
    },
    [onProviderPress, onProductPress, onServicePress],
  );

  const clearRecentSearches = useCallback(() => {
    clearRecentSearchesStorage();
    setRecentSearches([]);
  }, []);

  const clearRecentSearchViews = useCallback(() => {
    clearRecentSearchViewsStorage();
    setRecentSearchViews([]);
  }, []);

  const goToLocationPicker = useCallback(
    () => navigation.navigate(ROUTES.LOCATION_PICKER),
    [navigation],
  );

  const providers = data?.items ?? [];
  const products = productData?.items ?? [];
  const services = serviceData?.items ?? [];

  return {
    query,
    setQuery,
    minQueryLength: MIN_QUERY_LENGTH,
    type,
    selectType,
    locationLabel: location?.label ?? null,
    goToLocationPicker,
    hasActiveQuery,
    isProductSearch,
    isServiceSearch,
    isAllSearch,
    providers,
    products,
    services,
    resultCount: providers.length + products.length + services.length,
    isFetching:
      (runProviders && providersFetching) ||
      (runProducts && productsFetching) ||
      (runServices && servicesFetching),
    onProviderPress,
    onProductPress,
    onServicePress,
    recentSearches,
    recentSearchViews,
    onRecentSearchPress,
    onRecentViewPress,
    clearRecentSearches,
    clearRecentSearchViews,
  };
}
