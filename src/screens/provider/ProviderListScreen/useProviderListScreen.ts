import { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
import { ProviderListRouteProp } from './types';

/** Loads the available providers for the selected category/business type. */
export function useProviderListScreen() {
  const { params } = useRoute<ProviderListRouteProp>();

  const { data, isLoading } = useGetProvidersQuery({
    categorySlug: params.categorySlug,
    subcategorySlug: params.subcategorySlug,
    limit: 30,
  });

  const providers = data?.items ?? [];

  // Provider detail is the next build — inert for now.
  const onProviderPress = useCallback((_provider: Provider) => {}, []);

  return {
    title: params.title,
    providers,
    total: data?.pagination.total ?? providers.length,
    isLoading,
    onProviderPress,
  };
}
