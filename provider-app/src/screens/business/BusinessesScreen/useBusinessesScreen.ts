import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGetMyBusinessesQuery } from '@/redux/api/business/businessApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BusinessesScreen'>;

export function useBusinessesScreen() {
  const navigation = useNavigation<Nav>();
  const { data: businesses = [], isLoading, isFetching, refetch } = useGetMyBusinessesQuery();

  const openBusiness = (businessId: string) => {
    navigation.navigate(ROUTES.BUSINESS_DETAIL, { businessId });
  };

  return { businesses, isLoading, refreshing: isFetching, refresh: refetch, openBusiness };
}
