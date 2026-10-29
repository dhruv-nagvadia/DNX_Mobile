import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetMyBusinessQuery } from '@/redux/api/business/businessApi';
import { ROUTES } from '@/navigation/routes';

import { BusinessDetailNavigationProp, BusinessDetailRouteProp } from './types';

export function useBusinessDetailScreen() {
  const route = useRoute<BusinessDetailRouteProp>();
  const navigation = useNavigation<BusinessDetailNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);

  // Businesses with no `type` set behave as SERVICE (mirrors the web form's default).
  const isStore = business?.type === 'STORE';

  return {
    business,
    isStore,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    goToHours: () => navigation.navigate(ROUTES.BUSINESS_HOURS, { businessId }),
    goToCalendar: () => navigation.navigate(ROUTES.BUSINESS_CALENDAR, { businessId }),
    goToEdit: () => navigation.navigate(ROUTES.BUSINESS_EDIT, { businessId }),
    goToServices: () => navigation.navigate(ROUTES.SERVICES, { businessId }),
    goToProducts: () => navigation.navigate(ROUTES.PRODUCTS, { businessId }),
    goToStock: () => navigation.navigate(ROUTES.STOCK, { businessId }),
    goToCoupons: () => navigation.navigate(ROUTES.COUPONS, { businessId }),
    goToReviews: () => navigation.navigate(ROUTES.REVIEWS, { businessId }),
    goBack: () => navigation.goBack(),
  };
}
