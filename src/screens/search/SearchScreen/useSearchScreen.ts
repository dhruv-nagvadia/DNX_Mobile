import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';

import { SearchNavigationProp } from './types';

/** Live provider search by name/description. */
export function useSearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const hasQuery = trimmed.length >= 2;

  const { data, isFetching } = useGetProvidersQuery(
    { search: trimmed, limit: 30 },
    { skip: !hasQuery },
  );

  const onProviderPress = useCallback(
    (p: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName });
    },
    [navigation],
  );

  return {
    query,
    setQuery,
    providers: data?.items ?? [],
    isFetching,
    hasQuery,
    onProviderPress,
  };
}
