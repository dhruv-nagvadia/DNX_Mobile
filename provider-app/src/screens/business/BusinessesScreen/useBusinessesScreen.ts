import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGetMyBusinessesQuery } from '@/redux/api/business/businessApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BusinessesScreen'>;

export type BusinessFilter = 'ALL' | 'SERVICE' | 'STORE';

export function useBusinessesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: businesses = [], isLoading, isFetching, refetch } = useGetMyBusinessesQuery();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<BusinessFilter>('ALL');

  // Summary counts are over ALL businesses, not the filtered list.
  const counts = useMemo(() => {
    let verified = 0;
    let pending = 0;
    let blocked = 0;
    for (const b of businesses) {
      if (b.isBlocked) {
        blocked += 1;
      } else if (b.isVerified) {
        verified += 1;
      } else {
        pending += 1;
      }
    }
    return { verified, pending, blocked };
  }, [businesses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      const isStore = b.type === 'STORE';
      if (filter === 'STORE' && !isStore) {
        return false;
      }
      if (filter === 'SERVICE' && isStore) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [b.businessName, b.category?.name, b.subcategory?.name, b.city]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q));
    });
  }, [businesses, query, filter]);

  const openBusiness = (businessId: string) => {
    navigation.navigate(ROUTES.BUSINESS_DETAIL, { businessId });
  };

  const addBusiness = () => {
    navigation.navigate(ROUTES.BUSINESS_CREATE);
  };

  const editBusiness = (businessId: string) => {
    navigation.navigate(ROUTES.BUSINESS_EDIT, { businessId });
  };

  return {
    businesses,
    filtered,
    counts,
    query,
    setQuery,
    filter,
    setFilter,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    openBusiness,
    addBusiness,
    editBusiness,
  };
}
