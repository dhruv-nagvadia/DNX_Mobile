import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useDeleteBusinessMutation,
  useGetBusinessReviewsQuery,
  useGetMyBusinessQuery,
} from '@/redux/api/business/businessApi';
import { ROUTES } from '@/navigation/routes';

import { BusinessDetailNavigationProp, BusinessDetailRouteProp } from './types';

const RECENT_REVIEWS_LIMIT = 2;

export function useBusinessDetailScreen() {
  const route = useRoute<BusinessDetailRouteProp>();
  const navigation = useNavigation<BusinessDetailNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading, isFetching, refetch } = useGetMyBusinessQuery(businessId);
  const [deleteBusiness, { isLoading: deleting }] = useDeleteBusinessMutation();
  const { data: reviews = [] } = useGetBusinessReviewsQuery(businessId, { skip: !business || business.ratingCount === 0 });

  const recentReviews = useMemo(
    () =>
      [...reviews]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, RECENT_REVIEWS_LIMIT),
    [reviews],
  );

  // Businesses with no `type` set behave as SERVICE (mirrors the web form's default).
  const isStore = business?.type === 'STORE';

  const confirmDelete = () => {
    if (!business) {
      return;
    }
    Alert.alert(
      `Delete "${business.businessName}"?`,
      'This permanently removes the business, its services or products, and its booking/order history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBusiness(businessId).unwrap();
              navigation.goBack();
            } catch {
              Alert.alert('Could not delete the business', 'Please try again.');
            }
          },
        },
      ],
    );
  };

  return {
    business,
    isStore,
    isLoading,
    refreshing: isFetching,
    deleting,
    recentReviews,
    refresh: refetch,
    goToHours: () => navigation.navigate(ROUTES.BUSINESS_HOURS, { businessId }),
    goToCalendar: () => navigation.navigate(ROUTES.BUSINESS_CALENDAR, { businessId }),
    goToPhotos: () => navigation.navigate(ROUTES.BUSINESS_PHOTOS, { businessId }),
    goToBookingsOrders: () =>
      navigation.navigate(ROUTES.BOOKINGS_ORDERS, { businessId, tab: isStore ? 'orders' : 'bookings' }),
    goToEdit: () => navigation.navigate(ROUTES.BUSINESS_EDIT, { businessId }),
    goToServices: () => navigation.navigate(ROUTES.SERVICES, { businessId }),
    goToProducts: () => navigation.navigate(ROUTES.PRODUCTS, { businessId }),
    goToStock: () => navigation.navigate(ROUTES.STOCK, { businessId }),
    goToCoupons: () => navigation.navigate(ROUTES.COUPONS, { businessId }),
    goToReviews: () => navigation.navigate(ROUTES.REVIEWS, { businessId }),
    confirmDelete,
    goBack: () => navigation.goBack(),
  };
}
