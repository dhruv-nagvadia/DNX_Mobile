import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useAppSelector } from '@/redux/hooks';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { HomeScreenNavigationProp } from './types';

/** All state, data-fetching, and handlers for HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading, error, refetch } = useGetCategoriesQuery();

  const onCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate(ROUTES.PROVIDER_LIST, {
        categorySlug: category.slug,
        title: category.name,
      });
    },
    [navigation],
  );

  return {
    userName: currentUser?.fullName ?? 'there',
    categories,
    isLoading,
    error,
    refetch,
    onCategoryPress,
  };
}
