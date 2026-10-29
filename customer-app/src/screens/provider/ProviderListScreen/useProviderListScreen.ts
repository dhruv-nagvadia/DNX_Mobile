import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';
import { ProviderListNavigationProp, ProviderListRouteProp } from './types';

/** Loads the available providers for the selected category/business type. */
export function useProviderListScreen() {
  const navigation = useNavigation<ProviderListNavigationProp>();
  const { params } = useRoute<ProviderListRouteProp>();

  const { data, isLoading } = useGetProvidersQuery({
    categorySlug: params.categorySlug,
    subcategorySlug: params.subcategorySlug,
    limit: 30,
  });

  const providers = data?.items ?? [];

  const onProviderPress = useCallback(
    (provider: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: provider.id,
        name: provider.businessName,
      });
    },
    [navigation],
  );

  return {
    title: params.title,
    providers,
    total: data?.pagination.total ?? providers.length,
    isLoading,
    onProviderPress,
  };
}
